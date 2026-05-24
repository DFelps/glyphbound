import type { ItemSlot, Player } from '../types/game';
import { cloneItem, starterArmor, starterWeapon } from '../data/items';

const slots: ItemSlot[] = ['weapon', 'armor', 'charm', 'relic'];

export function createPlayer(): Player {
  const weapon = cloneItem(starterWeapon);
  const armor = cloneItem(starterArmor);

  return {
    name: 'Glyphbound',
    glyph: '@',
    hp: 52,
    maxHp: 52,
    level: 1,
    xp: 0,
    nextLevel: 20,
    gold: 80,
    inventory: [weapon, armor],
    equipment: {
      weapon,
      armor
    },
    materials: {
      wood: 0,
      iron: 0,
      pages: 0,
      bark: 0,
      crystal: 0,
      ink: 0
    }
  };
}

export function attackPower(player: Player): number {
  return Math.max(1, player.level + statTotal(player, 'attack'));
}

export function defensePower(player: Player): number {
  return Math.max(0, Math.floor(player.level / 2) + statTotal(player, 'defense'));
}

export function luckPower(player: Player): number {
  return Math.max(0, statTotal(player, 'luck'));
}

export function gainXp(player: Player, amount: number, levelCap = Number.POSITIVE_INFINITY): string[] {
  const messages: string[] = [];

  if (player.level >= levelCap) {
    player.xp = 0;
    return messages;
  }

  player.xp += amount;

  while (player.xp >= player.nextLevel && player.level < levelCap) {
    player.xp -= player.nextLevel;
    player.level += 1;
    player.maxHp += 5;
    player.hp = player.maxHp;
    player.nextLevel = Math.floor(player.nextLevel * 1.22 + 8);
    messages.push(`Level up: now level ${player.level}.`);
  }

  if (player.level >= levelCap) {
    player.xp = 0;
    messages.push(`Level cap reached for this area: ${levelCap}.`);
  }

  return messages;
}

function statTotal(player: Player, stat: 'attack' | 'defense' | 'luck'): number {
  return slots.reduce((total, slot) => total + (player.equipment[slot]?.stats[stat] ?? 0), 0);
}
