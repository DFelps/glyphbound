import type { GameState, Item } from '../types/game';
import { gachaTable } from '../data/items';
import { pick, roll } from './random';

export function drawGacha(state: GameState): void {
  const discount = state.event?.id === 'merchant-static' ? 80 : 120;

  if (state.player.gold < discount) {
    state.log.unshift('The Dealer smiles. Not enough gold.');
    return;
  }

  state.player.gold -= discount;

  const chance = Math.random();
  let item: Item | null = null;

  if (chance < 0.55) {
    state.log.unshift('The Dealer gave you dust. It looks almost valuable.');
    return;
  }

  if (chance < 0.75) {
    state.player.materials.glyphroot += 1;
    state.log.unshift('You pulled Glyphroot.');
    return;
  }

  item = structuredClone(pick(gachaTable));
  item.id = `${item.id}-${Date.now()}`;
  state.player.inventory.push(item);
  state.log.unshift(`You pulled ${item.name}.`);
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
    state.log.unshift(`${weapon.name} grew sharper. Power +1.`);
    return;
  }

  if (roll(0.3)) {
    weapon.power = Math.max(1, weapon.power - 1);
    weapon.unstable = true;
    state.log.unshift(`${weapon.name} rejected the glyph. Power -1.`);
    return;
  }

  state.player.equipment.weapon = undefined;
  state.player.inventory = state.player.inventory.filter((item) => item.id !== weapon.id);
  state.log.unshift(`${weapon.name} vanished into static.`);
}
