import type { AreaId, Enemy, GameState } from '../types/game';
import { generateLootItem } from '../data/items';
import { attackPower, defensePower, gainXp, luckPower } from './player';
import { between, roll } from './random';
import { allAreaOrder, nodes, regionAreaOrder } from '../data/world';
import { regionById, regionForArea } from '../data/regions';
import { advanceMineAfterWin } from './mine';

export function startCombat(state: GameState, enemy: Enemy, source: GameState['location']): void {
  const nextEnemy = structuredClone(enemy);

  if (nextEnemy.boss) {
    nextEnemy.maxHp += state.currentRegion === 2 ? 180 : 120;
    nextEnemy.hp = nextEnemy.maxHp;
    nextEnemy.attack += state.currentRegion === 2 ? 14 : 8;
    nextEnemy.defense += state.currentRegion === 2 ? 8 : 5;
  }

  state.combat = {
    active: true,
    enemy: nextEnemy,
    tick: 0,
    source
  };

  state.notice = null;
  state.log.unshift(`${nextEnemy.name} appeared. Combat is assisted.`);
}

export function combatStep(state: GameState): void {
  const enemy = state.combat.enemy;

  if (!state.combat.active || !enemy) {
    return;
  }

  state.combat.tick += 1;

  const playerHit = Math.max(1, attackPower(state.player) + between(0, 3) - enemy.defense);
  enemy.hp = Math.max(0, enemy.hp - playerHit);
  state.log.unshift(`Round ${state.combat.tick}: @ hits ${enemy.name} for ${playerHit}.`);

  if (enemy.hp <= 0) {
    winCombat(state, enemy);
    return;
  }

  const enemyHit = Math.max(1, enemy.attack + between(0, 3) - defensePower(state.player));
  state.player.hp = Math.max(0, state.player.hp - enemyHit);
  state.log.unshift(`Round ${state.combat.tick}: ${enemy.name} hits @ for ${enemyHit}.`);

  if (state.player.hp <= 0) {
    loseCombat(state, enemy);
  }
}

function winCombat(state: GameState, enemy: Enemy): void {
  const source = state.combat.source;
  const luck = luckPower(state.player);
  const gold = enemy.gold + between(0, Math.max(2, enemy.gold >> 2)) + Math.floor(luck * 1.5);
  let droppedItem = null;

  state.player.gold += gold;
  state.wiki.enemies[enemy.id] = true;

  if (enemy.rare) {
    state.wiki.rareEnemies[enemy.id] = true;
  }

  const xpMessages = gainXp(state.player, enemy.xp, levelCapFor(source));

  state.log.unshift(`Victory: ${enemy.name} defeated.`);
  state.log.unshift(`Rewards: +${enemy.xp} XP, +${gold} gold.`);

  for (const message of xpMessages) {
    state.log.unshift(message);
  }

  if (isAreaId(source) && roll(itemDropChance(enemy, luck))) {
    const item = generateLootItem(source);

    state.player.inventory.push(item);
    state.wiki.items[item.catalogId ?? item.templateId] = true;
    state.log.unshift(`[item] Loot found: ${item.rarity.toUpperCase()} ${item.name}.`);

    droppedItem = item;
  }

  if (source === 'deep-mine') {
    advanceMineAfterWin(state);

    if (roll(0.18)) {
      const key = state.mine.floor > 1000 ? 'hollow' : roll(0.5) ? 'ash' : 'cinder';
      state.player.materials[key] = (state.player.materials[key] ?? 0) + 1;
      state.log.unshift(`[material] Mine reward: 1 ${key}.`);
    }

    state.notice = {
      title: 'Mine Floor Cleared',
      message: `Reached floor ${state.mine.floor}. Max depth: ${state.mine.maxFloorReached}.`,
      kind: 'victory'
    };

    finishCombat(state);
    return;
  }

  if (enemy.boss) {
    finishBossCombat(state, enemy, droppedItem);
    return;
  }

  if (isAreaId(source)) {
    const progress = state.areaProgress[source];

    progress.fights += 1;

    const areaName = nodes[source].shortName;

    if (progress.fights >= 3 && !progress.cleared) {
      progress.fights = 3;
      progress.cleared = true;
      updateBossUnlock(state);

      state.notice = droppedItem
        ? {
            title: `${droppedItem.rarity.toUpperCase()} ITEM DROP`,
            message: `${droppedItem.name} was added to your inventory.`,
            kind: 'item'
          }
        : {
            title: 'Area Cleared',
            message: `${areaName} cleared. New forge gear can now appear.`,
            kind: 'victory'
          };

      state.log.unshift(`${areaName} cleared: 3/3 fights complete.`);
    } else {
      state.notice = droppedItem
        ? {
            title: `${droppedItem.rarity.toUpperCase()} ITEM DROP`,
            message: `${droppedItem.name} was added to your inventory.`,
            kind: 'item'
          }
        : {
            title: 'Victory',
            message: `${areaName} progress: ${progress.fights}/3 fights complete.`,
            kind: 'victory'
          };

      state.log.unshift(`${areaName} progress: ${progress.fights}/3 fights complete.`);
    }
  } else {
    state.notice = droppedItem
      ? {
          title: `${droppedItem.rarity.toUpperCase()} ITEM DROP`,
          message: `${droppedItem.name} was added to your inventory.`,
          kind: 'item'
        }
      : {
          title: 'Victory',
          message: `${enemy.name} defeated.`,
          kind: 'victory'
        };
  }

  finishCombat(state);
}

function finishBossCombat(state: GameState, enemy: Enemy, droppedItem: ReturnType<typeof generateLootItem> | null): void {
  state.defeatedBosses[enemy.id] = true;
  state.bossDefeated = true;
  state.player.hp = state.player.maxHp;

  if (enemy.id === 'the-watcher') {
    state.currentRegion = 2;
    state.unlockedSystems = ['mine', 'enchantments'];
    state.bossUnlocked = false;
    state.bossDefeated = false;
    state.location = 'ashen-refuge';
    state.forge.nextRefreshAt = 0;

    state.notice = droppedItem
      ? {
          title: `${droppedItem.rarity.toUpperCase()} ITEM DROP`,
          message: `${droppedItem.name} was added to your inventory. Ashen Depths unlocked.`,
          kind: 'item'
        }
      : {
          title: 'Ashen Depths',
          message: 'The Watcher fell. Region 2, Deep Mine and Enchantments are now available.',
          kind: 'victory'
        };

    state.log.unshift('The Watcher fell. The Ashen Depths opened.');
    state.log.unshift('Unlocked: 1500 Floor Mine and Glyph Anvil.');
    finishCombat(state);
    return;
  }

  if (enemy.id === 'hollow-king') {
    state.location = 'ashen-refuge';
    state.notice = {
      title: 'Region Complete',
      message: 'The Hollow King fell. Region 2 is complete for now.',
      kind: 'victory'
    };
    state.log.unshift('The Hollow King fell. Region 2 is complete.');
    finishCombat(state);
    return;
  }

  state.location = regionById[state.currentRegion].villageNodeId as GameState['location'];
  state.notice = {
    title: 'Victory',
    message: `${enemy.name} fell.`,
    kind: 'victory'
  };

  finishCombat(state);
}

function loseCombat(state: GameState, enemy: Enemy): void {
  const lostGold = Math.floor(state.player.gold * 0.3);

  state.player.gold = Math.max(0, state.player.gold - lostGold);
  state.player.xp = 0;
  state.player.hp = state.player.maxHp;
  state.location = regionById[state.currentRegion].villageNodeId as GameState['location'];

  state.notice = {
    title: 'Defeat',
    message: `${enemy.name} defeated you. Lost ${lostGold} gold and your current XP progress.`,
    kind: 'defeat'
  };

  state.log.unshift(`Defeat: ${enemy.name} defeated @.`);
  state.log.unshift(`Death penalty: lost ${lostGold} gold and XP progress was reset.`);
  state.log.unshift(`Returned to ${nodes[state.location].shortName}.`);

  finishCombat(state);
}

function finishCombat(state: GameState): void {
  state.combat = {
    active: false,
    enemy: null,
    tick: 0,
    source: regionById[state.currentRegion].villageNodeId as GameState['location']
  };
}

function isAreaId(value: string): value is AreaId {
  return allAreaOrder.includes(value as AreaId);
}

function itemDropChance(enemy: Enemy, luck: number): number {
  if (enemy.boss) {
    return 1;
  }

  const base = enemy.rare ? 0.04 : 0.008;
  return Math.min(0.08, base + luck * 0.0005);
}

function levelCapFor(source: GameState['location']): number {
  if (isAreaId(source)) {
    const region = regionForArea(source);
    return regionById[region].levelMax;
  }

  if (source === 'deep-mine') {
    return Number.POSITIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
}

function updateBossUnlock(state: GameState): void {
  const cleared = regionAreaOrder[state.currentRegion].every((id) => state.areaProgress[id].cleared);

  if (cleared && !state.bossUnlocked) {
    state.bossUnlocked = true;
    state.notice = {
      title: 'Boss Unlocked',
      message: `${regionById[state.currentRegion].boss} is now available.`,
      kind: 'info'
    };
    state.log.unshift(`${regionById[state.currentRegion].boss} is available.`);
  }
}
