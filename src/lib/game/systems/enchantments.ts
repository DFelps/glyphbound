import type { GameState, ItemSlot } from '../types/game';

const maxEnchantLevel = 20;

const enchantCostBase: Record<ItemSlot, number> = {
  weapon: 120,
  armor: 120,
  charm: 160,
  relic: 220
};

const enchantMaterial: Record<ItemSlot, string> = {
  weapon: 'obsidian',
  armor: 'ember',
  charm: 'ash',
  relic: 'script'
};

export function enchantEquippedItem(state: GameState, slot: ItemSlot): boolean {
  const item = state.player.equipment[slot];

  if (!item) {
    state.notice = {
      title: 'No Item Equipped',
      message: `Equip a ${slot} before enchanting.`,
      kind: 'info'
    };
    return false;
  }

  const current = item.enchantLevel ?? 0;

  if (current >= maxEnchantLevel) {
    state.notice = {
      title: 'Enchant Cap',
      message: `${item.name} is already +${maxEnchantLevel}.`,
      kind: 'info'
    };
    return false;
  }

  const next = current + 1;
  const goldCost = enchantCostBase[slot] + next * 55;
  const material = enchantMaterial[slot];
  const materialCost = Math.max(1, Math.ceil(next / 3));

  if (state.player.gold < goldCost || (state.player.materials[material] ?? 0) < materialCost) {
    state.notice = {
      title: 'Need More Grind',
      message: `Enchanting ${item.name} needs ${goldCost}g and ${materialCost} ${material}.`,
      kind: 'info'
    };
    return false;
  }

  state.player.gold -= goldCost;
  state.player.materials[material] = Math.max(0, (state.player.materials[material] ?? 0) - materialCost);

  item.enchantLevel = next;
  item.name = item.name.replace(/\s\+\d+$/, '') + ` +${next}`;

  if (slot === 'weapon') {
    item.stats.attack += 1;
  } else if (slot === 'armor') {
    item.stats.defense += 1;
  } else if (slot === 'charm') {
    item.stats.luck += 1;
  } else {
    item.stats.attack += 1;
    item.stats.defense += next % 2 === 0 ? 1 : 0;
  }

  state.notice = {
    title: 'Item Enchanted',
    message: `${item.name} improved to +${next}.`,
    kind: 'item'
  };

  state.log.unshift(`[item] Enchanted ${item.name}.`);
  return true;
}
