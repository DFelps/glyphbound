import { writable } from 'svelte/store';
import type { ActionId, AreaId, Enemy, GameState, Item, WorldNodeId } from '../types/game';
import { areaOrder, nodes } from '../data/world';
import { cloneEnemy, enemies, enemiesByArea } from '../data/enemies';
import { cloneItem, generateLootItem, rollForgeStock } from '../data/items';
import { createPlayer } from '../systems/player';
import { between, roll } from '../systems/random';
import { startCombat } from '../systems/combat';

const baseSaveKey = 'glyphbound-save-v12-inventory-fix';

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

function areaOneMaterials(existing: Partial<Record<string, number>> = {}) {
  return {
    wood: existing.wood ?? 0,
    iron: existing.iron ?? 0,
    pages: existing.pages ?? 0,
    bark: existing.bark ?? 0,
    crystal: existing.crystal ?? 0,
    ink: existing.ink ?? 0
  };
}

function initialState(): GameState {
  const createdAt = now();
  const player = createPlayer();
  player.materials = areaOneMaterials(player.materials);

  return {
    version: 11,
    location: 'village',
    player,
    combat: {
      active: false,
      enemy: null,
      tick: 0,
      source: 'village'
    },
    areaProgress: {
      'glyphroot-grove': { fights: 0, gathered: 0, cleared: false },
      'rust-mine': { fights: 0, gathered: 0, cleared: false },
      'sunken-library': { fights: 0, gathered: 0, cleared: false }
    },
    bossUnlocked: false,
    bossDefeated: false,
    notice: null,
    forge: {
      stock: rollForgeStock('glyphroot-grove', 4),
      lastRefreshAt: createdAt,
      nextRefreshAt: createdAt + forgeRefreshMs
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

    return normalizeState({
      ...fresh,
      ...parsed,
      version: 11,
      player: {
        ...fresh.player,
        ...parsed.player,
        materials: areaOneMaterials({
          ...fresh.player.materials,
          ...parsed.player?.materials
        }),
        equipment: {
          ...fresh.player.equipment,
          ...parsed.player?.equipment
        },
        inventory: parsed.player?.inventory ?? fresh.player.inventory
      },
      combat: {
        active: false,
        enemy: null,
        tick: 0,
        source: 'village'
      },
      areaProgress: {
        'glyphroot-grove': {
          ...fresh.areaProgress['glyphroot-grove'],
          ...parsed.areaProgress?.['glyphroot-grove']
        },
        'rust-mine': {
          ...fresh.areaProgress['rust-mine'],
          ...parsed.areaProgress?.['rust-mine']
        },
        'sunken-library': {
          ...fresh.areaProgress['sunken-library'],
          ...parsed.areaProgress?.['sunken-library']
        }
      },
      forge: {
        ...fresh.forge,
        ...parsed.forge,
        stock: parsed.forge?.stock?.length ? parsed.forge.stock : fresh.forge.stock
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
  restoreEquippedItemsToInventory(state);

  for (const item of state.player.inventory) {
    discoverItem(state, item);
  }

  for (const item of Object.values(state.player.equipment)) {
    if (item) {
      discoverItem(state, item);
    }
  }

  refreshForgeIfNeeded(state);
  return state;
}

function restoreEquippedItemsToInventory(state: GameState): void {
  const inventoryIds = new Set(state.player.inventory.map((item) => item.id));

  for (const item of Object.values(state.player.equipment)) {
    if (!item || inventoryIds.has(item.id)) {
      continue;
    }

    state.player.inventory.unshift(item);
    inventoryIds.add(item.id);
  }
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
    areaProgress: {
      'glyphroot-grove': { ...state.areaProgress['glyphroot-grove'] },
      'rust-mine': { ...state.areaProgress['rust-mine'] },
      'sunken-library': { ...state.areaProgress['sunken-library'] }
    },
    forge: {
      ...state.forge,
      stock: [...state.forge.stock]
    },
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

function highestForgeArea(state: GameState): AreaId {
  if (state.areaProgress['sunken-library'].cleared) {
    return 'sunken-library';
  }

  if (state.areaProgress['rust-mine'].cleared) {
    return 'rust-mine';
  }

  return 'glyphroot-grove';
}

function randomEnemyFor(location: WorldNodeId): Enemy {
  if (!isAreaId(location)) {
    return cloneEnemy('rootling');
  }

  const ids = enemiesByArea[location];
  const rare = ids.filter((id) => cloneEnemy(id as keyof typeof enemies).rare);
  const common = ids.filter((id) => !cloneEnemy(id as keyof typeof enemies).rare);

  if (rare.length && roll(location === 'glyphroot-grove' ? 0.025 : 0.018)) {
    return cloneEnemy(rare[between(0, rare.length - 1)] as keyof typeof enemies);
  }

  return cloneEnemy(common[between(0, common.length - 1)] as keyof typeof enemies);
}

function gatherFor(state: GameState, location: AreaId): void {
  const guaranteed: Record<AreaId, string> = {
    'glyphroot-grove': 'wood',
    'rust-mine': 'iron',
    'sunken-library': 'pages'
  };

  const names: Record<string, string> = {
    wood: 'Wood',
    iron: 'Iron',
    pages: 'Old Pages',
    bark: 'Living Bark',
    crystal: 'Fracture Crystal',
    ink: 'Black Ink'
  };

  const found: string[] = [];
  const common = guaranteed[location];

  addMaterial(state, common, 1);
  found.push(`1 ${names[common]}`);

  if (roll(0.12)) {
    const rare = roll(0.5) ? 'bark' : 'crystal';
    addMaterial(state, rare, 1);
    found.push(`1 ${names[rare]}`);
  }

  if (roll(0.025)) {
    addMaterial(state, 'ink', 1);
    found.push(`1 ${names.ink}`);
  }

  state.log.unshift(`[material] Gathered ${found.join(', ')}.`);
  state.areaProgress[location].gathered += 1;

  if (roll(nodes[location].danger * 0.08)) {
    startCombat(state, randomEnemyFor(location), location);
  }
}

function areaForItem(item: Item): AreaId {
  if (item.catalogId.startsWith('mine-')) {
    return 'rust-mine';
  }

  if (item.catalogId.startsWith('library-')) {
    return 'sunken-library';
  }

  return 'glyphroot-grove';
}

function forgeLevelRange(area: AreaId): { min: number; max: number } {
  if (area === 'glyphroot-grove') return { min: 1, max: 8 };
  if (area === 'rust-mine') return { min: 7, max: 14 };
  return { min: 13, max: 20 };
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
    state.log.unshift('Rested at the inn. HP restored.');
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

  if (action === 'go-forge') {
    state.location = 'old-forge';
    refreshForgeIfNeeded(state);
    state.log.unshift('Entered The Old Forge.');
    return;
  }

  if (action === 'go-boss') {
    if (!state.bossUnlocked) {
      state.log.unshift('The Watcher Gate is locked. Clear the 3 areas first.');
      return;
    }

    state.location = 'watcher-gate';
    state.log.unshift('The Watcher waits.');
    return;
  }

  if (action === 'back-village') {
    state.location = 'village';
    state.log.unshift('Returned to Glyphbound Village.');
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
    if (!state.bossUnlocked) {
      state.log.unshift('The gate is still locked.');
      return;
    }

    if (state.bossDefeated) {
      state.log.unshift('The Watcher is already defeated.');
      return;
    }

    const enemy = cloneEnemy('watcher');
    discoverEnemy(state, enemy);
    startCombat(state, enemy, 'watcher-gate');
  }
}

function isAreaId(value: WorldNodeId): value is AreaId {
  return areaOrder.includes(value as AreaId);
}

function createGameStore() {
  const store = writable<GameState>(initialState());
  let ready = false;

  function update(fn: (state: GameState) => void) {
    store.update((state) => {
      refreshForgeIfNeeded(state);
      fn(state);
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
