import { writable } from 'svelte/store';
import type { ActionId, AreaId, Enemy, GameState, Item, ItemSlot, RegionId, WorldNodeId } from '../types/game';
import { allAreaOrder, nodes, regionAreaOrder } from '../data/world';
import { regionById, regionForArea } from '../data/regions';
import { cloneEnemy, enemies, enemiesByArea } from '../data/enemies';
import { cloneItem, rollForgeStock } from '../data/items';
import { createPlayer } from '../systems/player';
import { between, roll } from '../systems/random';
import { startCombat } from '../systems/combat';
import { enchantEquippedItem } from '../systems/enchantments';
import { mineEnemyFor } from '../systems/mine';

const baseSaveKey = 'glyphbound-save-v13-region2';

export const saveSlots = ['slot-1', 'slot-2', 'slot-3'] as const;

export type SaveSlot = typeof saveSlots[number];

let activeSaveKey = `${baseSaveKey}:slot-1`;

export function saveKeyForSlot(slot: SaveSlot) {
  return `${baseSaveKey}:${slot}`;
}

function setActiveSaveSlot(slot: SaveSlot) {
  activeSaveKey = saveKeyForSlot(slot);
}

const forgeRefreshMs = 120000;

function now(): number {
  return Date.now();
}

function materialState(existing: Partial<Record<string, number>> = {}) {
  const keys = [
    'wood',
    'iron',
    'pages',
    'bark',
    'crystal',
    'ink',
    'obsidian',
    'ember',
    'script',
    'ash',
    'cinder',
    'hollow'
  ];

  return Object.fromEntries(keys.map((key) => [key, existing[key] ?? 0])) as Record<string, number>;
}

function emptyAreaProgress(existing: Partial<Record<AreaId, { fights?: number; gathered?: number; cleared?: boolean }>> = {}) {
  return Object.fromEntries(
    allAreaOrder.map((area) => [
      area,
      {
        fights: existing[area]?.fights ?? 0,
        gathered: existing[area]?.gathered ?? 0,
        cleared: existing[area]?.cleared ?? false
      }
    ])
  ) as GameState['areaProgress'];
}

function initialState(): GameState {
  const createdAt = now();
  const player = createPlayer();

  player.materials = materialState(player.materials);

  return {
    version: 13,
    currentRegion: 1,
    unlockedSystems: [],
    location: 'village',
    player,
    combat: {
      active: false,
      enemy: null,
      tick: 0,
      source: 'village'
    },
    areaProgress: emptyAreaProgress(),
    bossUnlocked: false,
    bossDefeated: false,
    defeatedBosses: {},
    notice: null,
    forge: {
      stock: rollForgeStock('glyphroot-grove', 4),
      lastRefreshAt: createdAt,
      nextRefreshAt: createdAt + forgeRefreshMs
    },
    mine: {
      floor: 1,
      maxFloorReached: 1,
      challengerUnlocked: false
    },
    wiki: {
      items: {},
      enemies: {},
      rareEnemies: {}
    },
    log: [
      'Welcome to Glyphbound.',
      'The Forge stock changes every 2 minutes.',
      'Clear Grove, Mine and Library to unlock The Watcher.'
    ]
  };
}

function loadState(): GameState {
  const fresh = initialState();

  if (typeof localStorage === 'undefined') {
    return fresh;
  }

  const raw = localStorage.getItem(activeSaveKey) ?? localStorage.getItem(baseSaveKey);

  if (!raw) {
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const currentRegion = parsed.currentRegion ?? (parsed.bossDefeated ? 2 : 1);

    return normalizeState({
      ...fresh,
      ...parsed,
      version: 13,
      currentRegion,
      unlockedSystems: parsed.unlockedSystems ?? (currentRegion >= 2 ? ['mine', 'enchantments'] : []),
      location: parsed.location ?? (currentRegion === 2 ? 'ashen-refuge' : 'village'),
      player: {
        ...fresh.player,
        ...parsed.player,
        materials: materialState({
          ...fresh.player.materials,
          ...parsed.player?.materials
        }),
        equipment: {
          ...fresh.player.equipment,
          ...parsed.player?.equipment
        },
        inventory: parsed.player?.inventory?.length ? parsed.player.inventory : fresh.player.inventory
      },
      combat: {
        active: false,
        enemy: null,
        tick: 0,
        source: 'village'
      },
      areaProgress: emptyAreaProgress(parsed.areaProgress),
      defeatedBosses: {
        ...fresh.defeatedBosses,
        ...parsed.defeatedBosses,
        ...(parsed.bossDefeated ? { watcher: true } : {})
      },
      forge: {
        ...fresh.forge,
        ...parsed.forge,
        stock: parsed.forge?.stock?.length ? parsed.forge.stock : fresh.forge.stock
      },
      mine: {
        ...fresh.mine,
        ...parsed.mine
      },
      wiki: {
        items: {
          ...fresh.wiki.items,
          ...parsed.wiki?.items
        },
        enemies: {
          ...fresh.wiki.enemies,
          ...parsed.wiki?.enemies
        },
        rareEnemies: {
          ...fresh.wiki.rareEnemies,
          ...parsed.wiki?.rareEnemies
        }
      },
      notice: null,
      log: parsed.log?.slice(0, 60) ?? fresh.log
    });
  } catch {
    return fresh;
  }
}

function normalizeState(state: GameState): GameState {
  for (const item of state.player.inventory) {
    discoverItem(state, item);
  }

  for (const item of Object.values(state.player.equipment)) {
    if (item) {
      discoverItem(state, item);

      if (!state.player.inventory.some((entry) => entry.id === item.id)) {
        state.player.inventory.push(item);
      }
    }
  }

  updateBossUnlock(state);
  refreshForgeIfNeeded(state);
  return state;
}

function saveState(state: GameState): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(activeSaveKey, JSON.stringify(state));
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    player: {
      ...state.player,
      inventory: [...state.player.inventory],
      equipment: { ...state.player.equipment },
      materials: { ...state.player.materials }
    },
    combat: {
      ...state.combat,
      enemy: state.combat.enemy ? { ...state.combat.enemy } : null
    },
    areaProgress: emptyAreaProgress(state.areaProgress),
    defeatedBosses: { ...state.defeatedBosses },
    unlockedSystems: [...state.unlockedSystems],
    forge: {
      ...state.forge,
      stock: [...state.forge.stock]
    },
    mine: { ...state.mine },
    wiki: {
      items: { ...state.wiki.items },
      enemies: { ...state.wiki.enemies },
      rareEnemies: { ...state.wiki.rareEnemies }
    },
    log: state.log.slice(0, 60)
  };
}

function canPay(state: GameState, cost = 0): boolean {
  return state.player.gold >= cost;
}

function hasMaterials(state: GameState, needs?: Partial<Record<string, number>>): boolean {
  if (!needs) {
    return true;
  }

  return Object.entries(needs).every(([key, value]) => (state.player.materials[key] ?? 0) >= (value ?? 0));
}

function payMaterials(state: GameState, needs?: Partial<Record<string, number>>): void {
  if (!needs) {
    return;
  }

  for (const [key, value] of Object.entries(needs)) {
    state.player.materials[key] = Math.max(0, (state.player.materials[key] ?? 0) - (value ?? 0));
  }
}

function addMaterial(state: GameState, key: string, amount: number): void {
  state.player.materials[key] = (state.player.materials[key] ?? 0) + amount;
}

function currentRegionAreas(state: GameState): AreaId[] {
  return regionAreaOrder[state.currentRegion];
}

function highestForgeArea(state: GameState): AreaId {
  const areas = currentRegionAreas(state);
  const cleared = areas.filter((area) => state.areaProgress[area].cleared);

  return cleared.at(-1) ?? areas[0];
}

function randomEnemyFor(location: WorldNodeId): Enemy {
  if (!isAreaId(location)) {
    return cloneEnemy('rootling');
  }

  const ids = enemiesByArea[location];
  const rare = ids.filter((id) => cloneEnemy(id as keyof typeof enemies).rare);
  const common = ids.filter((id) => !cloneEnemy(id as keyof typeof enemies).rare);
  const rareChance = regionForArea(location) === 1 ? 0.025 : 0.035;

  if (rare.length && roll(rareChance)) {
    return cloneEnemy(rare[between(0, rare.length - 1)] as keyof typeof enemies);
  }

  return cloneEnemy(common[between(0, common.length - 1)] as keyof typeof enemies);
}

function gatherFor(state: GameState, location: AreaId): void {
  const common: Record<AreaId, string> = {
    'glyphroot-grove': 'wood',
    'rust-mine': 'iron',
    'sunken-library': 'pages',
    'obsidian-pit': 'obsidian',
    'ashen-cathedral': 'ember',
    'void-archives': 'script'
  };

  const rare: Record<RegionId, string[]> = {
    1: ['bark', 'crystal'],
    2: ['ash', 'cinder']
  };

  const epic: Record<RegionId, string> = {
    1: 'ink',
    2: 'hollow'
  };

  const found: string[] = [];
  const region = regionForArea(location);
  const base = common[location];

  addMaterial(state, base, 1);
  found.push(`1 ${base}`);

  if (roll(region === 1 ? 0.12 : 0.14)) {
    const key = rare[region][between(0, rare[region].length - 1)];
    addMaterial(state, key, 1);
    found.push(`1 ${key}`);
  }

  if (roll(region === 1 ? 0.025 : 0.035)) {
    const key = epic[region];
    addMaterial(state, key, 1);
    found.push(`1 ${key}`);
  }

  state.log.unshift(`[material] Gathered ${found.join(', ')}.`);
  state.areaProgress[location].gathered += 1;

  if (roll(nodes[location].danger * 0.08)) {
    startCombat(state, randomEnemyFor(location), location);
  }
}

function areaForItem(item: Item): AreaId {
  if (item.catalogId.startsWith('mine-')) return 'rust-mine';
  if (item.catalogId.startsWith('library-')) return 'sunken-library';
  if (item.catalogId.startsWith('obsidian-')) return 'obsidian-pit';
  if (item.catalogId.startsWith('cathedral-')) return 'ashen-cathedral';
  if (item.catalogId.startsWith('archives-')) return 'void-archives';

  return 'glyphroot-grove';
}

function forgeLevelRange(area: AreaId): { min: number; max: number } {
  if (area === 'glyphroot-grove') return { min: 1, max: 8 };
  if (area === 'rust-mine') return { min: 7, max: 14 };
  if (area === 'sunken-library') return { min: 13, max: 20 };
  if (area === 'obsidian-pit') return { min: 20, max: 27 };
  if (area === 'ashen-cathedral') return { min: 27, max: 34 };
  return { min: 34, max: 40 };
}

function stockMatchesArea(state: GameState, area: AreaId): boolean {
  const range = forgeLevelRange(area);
  return state.forge.stock.every((item) => areaForItem(item) === area && item.level >= range.min && item.level <= range.max);
}

function refreshForgeIfNeeded(state: GameState): void {
  const time = now();
  const area = highestForgeArea(state);

  if (time < state.forge.nextRefreshAt && stockMatchesArea(state, area)) {
    return;
  }

  state.forge.stock = rollForgeStock(area, 4);
  state.forge.lastRefreshAt = time;
  state.forge.nextRefreshAt = time + forgeRefreshMs;
  state.log.unshift('The Forge stock changed. Someone else bought the old items.');
}

function manualRefreshForge(state: GameState): void {
  const area = highestForgeArea(state);
  const time = now();

  state.forge.stock = rollForgeStock(area, 4);
  state.forge.lastRefreshAt = time;
  state.forge.nextRefreshAt = time + forgeRefreshMs;
  state.log.unshift('Forge stock refreshed.');
}

function buyForgeItem(state: GameState, itemId: string): void {
  refreshForgeIfNeeded(state);

  const item = state.forge.stock.find((entry) => entry.id === itemId);

  if (!item) {
    state.log.unshift('That item is gone. The Forge stock already changed.');
    return;
  }

  if (!canPay(state, item.cost.gold) || !hasMaterials(state, item.cost.materials)) {
    state.notice = {
      title: 'Need More Grind',
      message: `You need more gold or materials for ${item.name}. Check the item source.`,
      kind: 'info'
    };
    state.log.unshift(`Not enough resources for ${item.name}.`);
    return;
  }

  state.player.gold -= item.cost.gold;
  payMaterials(state, item.cost.materials);

  const bought = cloneItem(item);
  state.player.inventory.push(bought);
  state.forge.stock = state.forge.stock.filter((entry) => entry.id !== item.id);

  discoverItem(state, bought);

  state.notice = {
    title: `${item.rarity.toUpperCase()} ITEM BOUGHT`,
    message: `${bought.name} was added to your inventory.`,
    kind: 'victory'
  };

  state.log.unshift(`Bought ${bought.name} from the Forge.`);
}

function discoverItem(state: GameState, item: Item): void {
  state.wiki.items[item.catalogId ?? item.templateId] = true;
}

function discoverEnemy(state: GameState, enemy: Enemy): void {
  state.wiki.enemies[enemy.id] = true;

  if (enemy.rare) {
    state.wiki.rareEnemies[enemy.id] = true;
    state.notice = {
      title: 'Rare Monster',
      message: `${enemy.name} was added to your wiki.`,
      kind: 'info'
    };
  }
}

function goHome(state: GameState): void {
  state.location = regionById[state.currentRegion].villageNodeId as WorldNodeId;
}

function unlockRegionTwo(state: GameState): void {
  state.currentRegion = 2;
  state.unlockedSystems = ['mine', 'enchantments'];
  state.bossUnlocked = false;
  state.bossDefeated = false;
  state.location = 'ashen-refuge';
  state.player.hp = state.player.maxHp;
  state.forge.nextRefreshAt = 0;
  refreshForgeIfNeeded(state);

  state.notice = {
    title: 'Ashen Depths',
    message: 'The Watcher fell. The Ashen Refuge, Deep Mine and Glyph Anvil are now available.',
    kind: 'victory'
  };

  state.log.unshift('Region 2 unlocked: Ashen Depths.');
  state.log.unshift('New systems unlocked: 1500 Floor Mine and Enchantments.');
}


function applyCheatMode(state: GameState): void {
  state.currentRegion = 2;
  state.unlockedSystems = ['mine', 'enchantments'];
  state.location = 'ashen-refuge';
  state.bossUnlocked = true;
  state.bossDefeated = false;
  state.defeatedBosses.watcher = true;

  state.player.level = 40;
  state.player.xp = 0;
  state.player.nextLevel = 999999;
  state.player.maxHp = 999;
  state.player.hp = 999;
  state.player.gold = 999999;

  for (const key of Object.keys(state.player.materials)) {
    state.player.materials[key] = 999;
  }

  for (const area of allAreaOrder) {
    state.areaProgress[area].fights = 3;
    state.areaProgress[area].gathered = Math.max(state.areaProgress[area].gathered, 3);
    state.areaProgress[area].cleared = true;
  }

  const weapon = state.player.equipment.weapon;
  const armor = state.player.equipment.armor;
  const charm = state.player.equipment.charm;
  const relic = state.player.equipment.relic;

  if (weapon) {
    weapon.level = Math.min(40, Math.max(weapon.level, 20));
    weapon.power = Math.max(weapon.power, 999);
    weapon.stats.attack = 999;
  }

  if (armor) {
    armor.level = Math.min(40, Math.max(armor.level, 20));
    armor.power = Math.max(armor.power, 999);
    armor.stats.defense = 999;
  }

  if (charm) {
    charm.stats.luck = 999;
  }

  if (relic) {
    relic.stats.attack = Math.max(relic.stats.attack, 250);
    relic.stats.defense = Math.max(relic.stats.defense, 250);
    relic.stats.luck = Math.max(relic.stats.luck, 250);
  }

  state.mine.floor = 1;
  state.mine.maxFloorReached = Math.max(state.mine.maxFloorReached, 1000);
  state.mine.challengerUnlocked = true;
  state.forge.nextRefreshAt = 0;
  refreshForgeIfNeeded(state);

  state.notice = {
    title: 'Cheat Mode',
    message: 'Dev power applied: Region 2, 999 HP, massive gear, gold and materials.',
    kind: 'info'
  };

  state.log.unshift('[dev] Cheat mode applied. Region 2, mine and enchantments are unlocked.');
}

function updateBossUnlock(state: GameState): void {
  const areas = currentRegionAreas(state);
  const cleared = areas.every((id) => state.areaProgress[id].cleared);

  if (cleared && !state.bossUnlocked) {
    state.bossUnlocked = true;
    state.log.unshift(`${regionById[state.currentRegion].boss} is available.`);
  }
}

function doAction(state: GameState, action: ActionId): void {
  refreshForgeIfNeeded(state);

  const node = nodes[state.location];
  const actionData = node.actions.find((entry) => entry.id === action);

  if (!actionData) {
    return;
  }

  if (!canPay(state, actionData.cost) || !hasMaterials(state, actionData.needs)) {
    state.log.unshift('Not enough gold or materials.');
    return;
  }

  if (actionData.cost) {
    state.player.gold -= actionData.cost;
  }

  payMaterials(state, actionData.needs);

  if (action === 'rest') {
    state.player.hp = state.player.maxHp;
    state.log.unshift('Rested. HP restored.');
    return;
  }

  if (action === 'go-grove') {
    state.location = 'glyphroot-grove';
    state.log.unshift('Entered Glyphroot Grove.');
    return;
  }

  if (action === 'go-mine') {
    state.location = 'rust-mine';
    state.log.unshift('Entered Rust Mine.');
    return;
  }

  if (action === 'go-library') {
    state.location = 'sunken-library';
    state.log.unshift('Entered Sunken Library.');
    return;
  }

  if (action === 'go-obsidian') {
    state.location = 'obsidian-pit';
    state.log.unshift('Entered Obsidian Pit.');
    return;
  }

  if (action === 'go-cathedral') {
    state.location = 'ashen-cathedral';
    state.log.unshift('Entered Ashen Cathedral.');
    return;
  }

  if (action === 'go-archives') {
    state.location = 'void-archives';
    state.log.unshift('Entered Void Archives.');
    return;
  }

  if (action === 'go-forge') {
    state.location = 'old-forge';
    refreshForgeIfNeeded(state);
    state.log.unshift('Entered The Old Forge.');
    return;
  }

  if (action === 'go-deep-mine') {
    if (!state.unlockedSystems.includes('mine')) {
      state.log.unshift('The Deep Mine unlocks after The Watcher.');
      return;
    }

    state.location = 'deep-mine';
    state.log.unshift(`Entered the 1500 Floor Mine at floor ${state.mine.floor}.`);
    return;
  }

  if (action === 'go-enchanter') {
    if (!state.unlockedSystems.includes('enchantments')) {
      state.log.unshift('Enchantments unlock after The Watcher.');
      return;
    }

    state.location = 'glyph-anvil';
    state.log.unshift('Opened The Glyph Anvil.');
    return;
  }

  if (action === 'go-boss') {
    if (!state.bossUnlocked || state.currentRegion !== 1) {
      state.log.unshift('The Watcher Gate is locked. Clear the 3 areas first.');
      return;
    }

    state.location = 'watcher-gate';
    state.log.unshift('The Watcher waits.');
    return;
  }

  if (action === 'go-hollow-boss') {
    if (!state.bossUnlocked || state.currentRegion !== 2) {
      state.log.unshift('The Hollow Gate is locked. Clear the 3 Ashen areas first.');
      return;
    }

    state.location = 'hollow-gate';
    state.log.unshift('The Hollow King waits.');
    return;
  }

  if (action === 'back-village' || action === 'leave-mine') {
    goHome(state);
    state.log.unshift(`Returned to ${nodes[state.location].shortName}.`);
    return;
  }

  if (action === 'fight' && isAreaId(state.location)) {
    const enemy = randomEnemyFor(state.location);
    discoverEnemy(state, enemy);
    startCombat(state, enemy, state.location);
    return;
  }

  if (action === 'gather' && isAreaId(state.location)) {
    gatherFor(state, state.location);
    return;
  }

  if (action === 'challenge-boss') {
    if (!state.bossUnlocked || state.currentRegion !== 1) {
      state.log.unshift('The gate is still locked.');
      return;
    }

    const enemy = cloneEnemy('watcher');
    discoverEnemy(state, enemy);
    startCombat(state, enemy, 'watcher-gate');
    return;
  }

  if (action === 'challenge-hollow-king') {
    if (!state.bossUnlocked || state.currentRegion !== 2) {
      state.log.unshift('The Hollow Gate is still locked.');
      return;
    }

    const enemy = cloneEnemy('hollowKing');
    discoverEnemy(state, enemy);
    startCombat(state, enemy, 'hollow-gate');
    return;
  }

  if (action === 'mine-floor') {
    const enemy = mineEnemyFor(state);
    startCombat(state, enemy, 'deep-mine');
    return;
  }

  if (action === 'enchant-weapon') enchantEquipped(state, 'weapon');
  if (action === 'enchant-armor') enchantEquipped(state, 'armor');
  if (action === 'enchant-charm') enchantEquipped(state, 'charm');
  if (action === 'enchant-relic') enchantEquipped(state, 'relic');
}

function enchantEquipped(state: GameState, slot: ItemSlot): void {
  if (!state.unlockedSystems.includes('enchantments')) {
    state.log.unshift('Enchantments are locked.');
    return;
  }

  enchantEquippedItem(state, slot);
}

function isAreaId(value: WorldNodeId): value is AreaId {
  return allAreaOrder.includes(value as AreaId);
}

function createGameStore() {
  const store = writable<GameState>(initialState());
  let ready = false;

  function update(fn: (state: GameState) => void) {
    store.update((state: GameState) => {
      refreshForgeIfNeeded(state);
      fn(state);
      updateBossUnlock(state);
      const next = cloneState(state);

      if (ready) {
        saveState(next);
      }

      return next;
    });
  }

  return {
    subscribe: store.subscribe,
    boot(slot: SaveSlot = 'slot-1') {
      setActiveSaveSlot(slot);
      store.set(loadState());
      ready = true;
    },
    setSlot(slot: SaveSlot) {
      setActiveSaveSlot(slot);
      store.set(loadState());
      ready = true;
    },
    act(action: ActionId) {
      update((state) => {
        if (state.combat.active) {
          state.log.unshift('Combat is assisted. You can only watch.');
          return;
        }

        state.notice = null;
        doAction(state, action);
      });
    },
    buyForgeItem(itemId: string) {
      update((state) => buyForgeItem(state, itemId));
    },
    refreshForge() {
      update((state) => manualRefreshForge(state));
    },
    clearNotice() {
      update((state) => {
        state.notice = null;
      });
    },
    unlockRegionTwo() {
      update((state) => unlockRegionTwo(state));
    },
    equip(item: Item) {
      update((state) => {
        if (!item.slot) {
          state.log.unshift(`${item.name} cannot be equipped.`);
          return;
        }

        if (state.player.level < item.level) {
          state.notice = {
            title: 'Level Required',
            message: `${item.name} requires level ${item.level}.`,
            kind: 'info'
          };
          state.log.unshift(`${item.name} requires level ${item.level}.`);
          return;
        }

        state.player.equipment[item.slot] = item;
        discoverItem(state, item);
        state.log.unshift(`Equipped ${item.name}.`);
      });
    },
    cheatMode() {
      update((state) => applyCheatMode(state));
    },
    reset() {
      const fresh = initialState();

      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(activeSaveKey);
      }

      store.set(fresh);

      if (ready) {
        saveState(fresh);
      }
    },
    rawUpdate: update
  };
}

export const game = createGameStore();

export function completeWatcherTransition(state: GameState): void {
  unlockRegionTwo(state);
}
