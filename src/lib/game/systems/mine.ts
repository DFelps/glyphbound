import type { Enemy, GameState } from '../types/game';
import { between } from './random';

export function mineEnemyFor(state: GameState): Enemy {
  const floor = state.mine.floor;
  const tier = Math.floor(floor / 25);
  const challenger = floor > 1000;
  const hp = 34 + floor * 2 + tier * 8 + (challenger ? 280 : 0);
  const attack = 10 + Math.floor(floor / 12) + (challenger ? 22 : 0);
  const defense = Math.floor(floor / 30) + (challenger ? 8 : 0);
  const xp = 16 + Math.floor(floor * 1.8);
  const gold = 28 + Math.floor(floor * 2.4) + between(0, 10);

  return {
    id: `mine-floor-${floor}`,
    name: challenger ? `Challenger Depth ${floor}` : `Mine Depth ${floor}`,
    glyph: 'm',
    hp,
    maxHp: hp,
    attack,
    defense,
    xp,
    gold,
    art: [
      '     ______',
      '    / ____\\',
      '   /_/ [] \\_\\',
      `   | floor ${String(floor).padStart(4, '0')} |`,
      '   |__    __|',
      '      |__|'
    ].join('\n')
  };
}

export function advanceMineAfterWin(state: GameState): void {
  state.mine.maxFloorReached = Math.max(state.mine.maxFloorReached, state.mine.floor);

  if (state.mine.floor >= 1000) {
    state.mine.challengerUnlocked = true;
  }

  if (state.mine.floor < 1500) {
    state.mine.floor += 1;
  }

  state.log.unshift(`Mine progress: floor ${state.mine.floor}/1500.`);
}
