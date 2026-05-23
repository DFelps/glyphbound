import type { ItemSlot, Player } from '../types/game';
import { starterArmor, starterWeapon } from '../data/items';

export function createPlayer(): Player {
  return {
    name: 'The Fragment',
    glyph: '@',
    hp: 42,
    maxHp: 42,
    level: 1,
    xp: 0,
    nextLevel: 22,
    gold: 60,
    inventory: [starterWeapon, starterArmor],
    equipment: {
      weapon: starterWeapon,
      armor: starterArmor
    },
    materials: {
      wood: 0,
      bark: 0,
      iron: 0,
      crystal: 0,
      glyphroot: 0,
      pages: 0,
      ink: 0,
      nullscrap: 0
    }
  };
}

export function attackPower(player: Player): number {
  return 2 + player.level + gearAttack(player, 'weapon') + gearAttack(player, 'charm') + gearAttack(player, 'relic');
}

export function defensePower(player: Player): number {
  return Math.floor(player.level / 2) + gearDefense(player, 'armor') + gearDefense(player, 'relic');
}

export function luckPower(player: Player): number {
  return Object.values(player.equipment).reduce((total, item) => total + (item?.stats.luck ?? 0), 0);
}

export function gearPower(player: Player, slot: ItemSlot): number {
  return player.equipment[slot]?.power ?? 0;
}

export function gearAttack(player: Player, slot: ItemSlot): number {
  return player.equipment[slot]?.stats.attack ?? 0;
}

export function gearDefense(player: Player, slot: ItemSlot): number {
  return player.equipment[slot]?.stats.defense ?? 0;
}

export function gainXp(player: Player, amount: number, maxLevel = Number.POSITIVE_INFINITY): string[] {
  const messages: string[] = [];

  if (player.level >= maxLevel) {
    player.xp = 0;
    messages.push(`Area level cap reached. Move forward to grow stronger.`);
    return messages;
  }

  player.xp += amount;

  while (player.xp >= player.nextLevel) {
    player.xp -= player.nextLevel;
    player.level += 1;
    player.maxHp += 7;
    player.hp = player.maxHp;
    player.nextLevel = Math.floor(player.nextLevel * 1.42 + 8);
    messages.push(`Level up. ${player.name} reached level ${player.level}.`);

    if (player.level >= maxLevel) {
      player.xp = 0;
      messages.push(`Area level cap reached. Move forward to grow stronger.`);
      break;
    }
  }

  return messages;
}