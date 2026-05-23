import type { GameState } from '../types/game';
import { generateLootItem } from '../data/items';
import { roll } from './random';

export function drawGacha(state: GameState): void {
  const price = 120;

  if (state.player.gold < price) {
    state.log.unshift('The Dealer smiles. Not enough gold.');
    return;
  }

  state.player.gold -= price;

  const chance = Math.random();

  if (chance < 0.55) {
    state.log.unshift('The Dealer gave you dust. It looks almost valuable.');
    return;
  }

  if (chance < 0.75) {
    state.player.materials.glyphroot += 1;
    state.log.unshift('[material] You pulled Glyphroot.');
    return;
  }

  const item = generateLootItem('glyphroot-grove');
  item.id = `${item.id}-${Date.now()}`;

  state.player.inventory.push(item);
  state.wiki.items[item.catalogId ?? item.templateId] = true;

  state.notice = {
    title: `${item.rarity.toUpperCase()} ITEM DROP`,
    message: `${item.name} was added to your inventory.`,
    kind: 'item'
  };

  state.log.unshift(`[item] You pulled ${item.rarity.toUpperCase()} ${item.name}.`);
}

export function upgradeEquippedWeapon(state: GameState): void {
  const weapon = state.player.equipment.weapon;

  if (!weapon) {
    state.log.unshift('No weapon equipped.');
    return;
  }

  if (state.player.gold < 40) {
    state.log.unshift('The forge wants 40 gold.');
    return;
  }

  state.player.gold -= 40;

  if (roll(0.6)) {
    weapon.power += 1;
    weapon.stats.attack += 1;
    state.log.unshift(`${weapon.name} grew sharper. Attack +1.`);
    return;
  }

  if (roll(0.3)) {
    weapon.power = Math.max(1, weapon.power - 1);
    weapon.stats.attack = Math.max(0, weapon.stats.attack - 1);
    state.log.unshift(`${weapon.name} rejected the glyph. Attack -1.`);
    return;
  }

  state.player.equipment.weapon = undefined;
  state.player.inventory = state.player.inventory.filter((item) => item.id !== weapon.id);
  state.log.unshift(`${weapon.name} vanished into static.`);
}