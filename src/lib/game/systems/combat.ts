import type { AreaId, Enemy, GameState } from '../types/game';
import { generateLootItem } from '../data/items';
import { attackPower, defensePower, gainXp, luckPower } from './player';
import { between, roll } from './random';
import { areaOrder, nodes } from '../data/world';

export function startCombat(state: GameState, enemy: Enemy, source: GameState['location']): void {
  const nextEnemy = structuredClone(enemy);

  if (nextEnemy.boss) {
    nextEnemy.maxHp += 120;
    nextEnemy.hp = nextEnemy.maxHp;
    nextEnemy.attack += 8;
    nextEnemy.defense += 5;
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

  if (enemy.boss) {
    state.bossDefeated = true;
    state.location = 'village';
    state.player.hp = state.player.maxHp;
    state.notice = droppedItem
      ? {
          title: `${droppedItem.rarity.toUpperCase()} ITEM DROP`,
          message: `${droppedItem.name} was added to your inventory.`,
          kind: 'item'
        }
      : {
          title: 'Victory',
          message: 'The Watcher fell. The first region is complete.',
          kind: 'victory'
        };

    state.log.unshift('The Watcher fell. The first region is complete.');
    finishCombat(state);
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

function loseCombat(state: GameState, enemy: Enemy): void {
  const lostGold = Math.floor(state.player.gold * 0.3);

  state.player.gold = Math.max(0, state.player.gold - lostGold);
  state.player.xp = 0;
  state.player.hp = state.player.maxHp;
  state.location = 'village';

  state.notice = {
    title: 'Defeat',
    message: `${enemy.name} defeated you. Lost ${lostGold} gold and your current XP progress.`,
    kind: 'defeat'
  };

  state.log.unshift(`Defeat: ${enemy.name} defeated @.`);
  state.log.unshift(`Death penalty: lost ${lostGold} gold and XP progress was reset.`);
  state.log.unshift('Returned to Glyphbound Village.');

  finishCombat(state);
}


function finishCombat(state: GameState): void {
  state.combat = {
    active: false,
    enemy: null,
    tick: 0,
    source: 'village'
  };
}

function isAreaId(value: string): value is AreaId {
  return areaOrder.includes(value as AreaId);
}

function itemDropChance(enemy: Enemy, luck: number): number {
  if (enemy.boss) {
    return 1;
  }

  const base = enemy.rare ? 0.04 : 0.008;
  return Math.min(0.08, base + luck * 0.0005);
}

function levelCapFor(source: GameState['location']): number {
  if (source === 'glyphroot-grove') {
    return 20;
  }

  if (source === 'rust-mine') {
    return 35;
  }

  if (source === 'sunken-library') {
    return 50;
  }

  return Number.POSITIVE_INFINITY;
}


function updateBossUnlock(state: GameState): void {
  const cleared = areaOrder.every((id) => state.areaProgress[id].cleared);

  if (cleared && !state.bossUnlocked) {
    state.bossUnlocked = true;
    state.notice = {
      title: 'Boss Unlocked',
      message: 'The Watcher Gate opened. Farm one last upgrade before entering.',
      kind: 'info'
    };
    state.log.unshift('The Watcher Gate opened. The boss is available in the village.');
  }
}
