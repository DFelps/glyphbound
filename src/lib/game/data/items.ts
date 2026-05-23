import type { AreaId, Item, ItemSlot, Rarity } from '../types/game';

type ItemCatalogEntry = {
  id: string;
  name: string;
  slot: ItemSlot;
  minLevel: number;
  rarity?: Rarity;
  source: string;
  text: string;
  art?: string;
};

const rarityOrder: Rarity[] = ['normal', 'rare', 'epic', 'legendary', 'unique'];

const rarityConfig: Record<Rarity, {
  label: string;
  multiplier: number;
  cost: number;
  materials: number;
  statRolls: number;
}> = {
  normal: { label: 'Normal', multiplier: 1, cost: 1, materials: 1, statRolls: 0 },
  rare: { label: 'Rare', multiplier: 1.25, cost: 2.4, materials: 2, statRolls: 1 },
  epic: { label: 'Epic', multiplier: 1.55, cost: 6, materials: 4, statRolls: 2 },
  legendary: { label: 'Legendary', multiplier: 2.2, cost: 18, materials: 10, statRolls: 3 },
  unique: { label: 'Unique', multiplier: 3.2, cost: 45, materials: 22, statRolls: 5 }
};

const slots: Record<ItemSlot, {
  glyph: string;
  art: string;
  text: string;
}> = {
  weapon: {
    glyph: '/',
    art: '[ / ]',
    text: 'Main attack item. If combat feels slow, upgrade this first.'
  },
  armor: {
    glyph: '#',
    art: '[ # ]',
    text: 'Main defense item. If you keep dying, get better armor.'
  },
  charm: {
    glyph: 'o',
    art: '[ o ]',
    text: 'Small bonus item. Good for attack and luck.'
  },
  relic: {
    glyph: 'x',
    art: '[ x ]',
    text: 'Rare power item. Usually expensive, sometimes absurd.'
  }
};

export const areaNames: Record<AreaId, string> = {
  'glyphroot-grove': 'Glyphroot Grove',
  'rust-mine': 'Rust Mine',
  'sunken-library': 'Sunken Library'
};

const groveRareItems = new Set([
  'grove-green-eye',
  'grove-root-coin',
  'grove-null-bark'
]);

const groveEpicItems = new Set([
  'grove-first-root',
  'grove-dealer-leaf'
]);

function catalogRarity(entry: ItemCatalogEntry, area: AreaId): Rarity {
  if (entry.rarity) {
    return entry.rarity;
  }

  if (area === 'glyphroot-grove') {
    if (groveEpicItems.has(entry.id)) return 'epic';
    if (groveRareItems.has(entry.id)) return 'rare';
    return 'normal';
  }

  if (entry.source.toLowerCase().includes('very rare')) {
    return 'epic';
  }

  if (entry.source.toLowerCase().includes('rare')) {
    return 'rare';
  }

  return 'normal';
}

export const materialInfo: Record<string, {
  label: string;
  rarity: Rarity;
  source: string;
}> = {
  wood: { label: 'Wood', rarity: 'normal', source: 'Common gather from Glyphroot Grove.' },
  bark: { label: 'Living Bark', rarity: 'rare', source: 'Rare gather from Glyphroot Grove.' },
  glyphroot: { label: 'Glyphroot', rarity: 'rare', source: 'Main gather from Glyphroot Grove.' },
  iron: { label: 'Iron', rarity: 'rare', source: 'Main gather from Rust Mine.' },
  crystal: { label: 'Fracture Crystal', rarity: 'epic', source: 'Rare gather from Rust Mine.' },
  pages: { label: 'Old Pages', rarity: 'epic', source: 'Main gather from Sunken Library.' },
  ink: { label: 'Black Ink', rarity: 'epic', source: 'Rare gather from Sunken Library.' },
  nullscrap: { label: 'Null Scrap', rarity: 'legendary', source: 'Rare cursed material from Library, rare mobs and high rarity items.' }
};

export const itemCatalogByArea: Record<AreaId, ItemCatalogEntry[]> = {
  'glyphroot-grove': [
    { id: 'grove-splinter-knife', name: 'Splinter Knife', slot: 'weapon', minLevel: 1, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'A quick starter blade from living wood.' },
    { id: 'grove-root-staff', name: 'Root Staff', slot: 'weapon', minLevel: 2, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'A branch that remembers where it hit.' },
    { id: 'grove-thorn-hook', name: 'Thorn Hook', slot: 'weapon', minLevel: 3, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Good at pulling bad ideas closer.' },
    { id: 'grove-bark-axe', name: 'Bark Axe', slot: 'weapon', minLevel: 4, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Ugly, sharp, reliable.' },
    { id: 'grove-green-wand', name: 'Green Wand', slot: 'weapon', minLevel: 5, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Not real magic yet, but close enough.' },
    { id: 'grove-patched-cloak', name: 'Patched Cloak', slot: 'armor', minLevel: 1, source: 'Starter/Glyphroot Grove.', text: 'Light cloth for early mistakes.' },
    { id: 'grove-bark-vest', name: 'Bark Vest', slot: 'armor', minLevel: 2, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'It bends before it breaks.' },
    { id: 'grove-moss-wrap', name: 'Moss Wrap', slot: 'armor', minLevel: 3, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Smells safe. Probably safe.' },
    { id: 'grove-hollow-guard', name: 'Hollow Guard', slot: 'armor', minLevel: 5, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'A piece of tree pretending to be armor.' },
    { id: 'grove-root-mail', name: 'Root Mail', slot: 'armor', minLevel: 7, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Roots knit themselves tighter when hit.' },
    { id: 'grove-tiny-loop', name: 'Tiny Loop', slot: 'charm', minLevel: 1, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Small luck. Small price. Small addiction.' },
    { id: 'grove-sap-charm', name: 'Sap Charm', slot: 'charm', minLevel: 2, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Sticky fortune.' },
    { id: 'grove-wild-knot', name: 'Wild Knot', slot: 'charm', minLevel: 3, source: 'Glyphroot Grove fights and Forge after Area 1.', text: 'Nobody knows how to untie it.' },
    { id: 'grove-green-eye', name: 'Green Eye', slot: 'charm', minLevel: 6, source: 'Glyphroot Grove rare monsters.', text: 'It blinks when loot is near.' },
    { id: 'grove-root-coin', name: 'Root Coin', slot: 'charm', minLevel: 8, source: 'Glyphroot Grove rare monsters and Forge.', text: 'The Dealer refuses to touch it.' },
    { id: 'grove-old-seed', name: 'Old Seed', slot: 'relic', minLevel: 4, source: 'Glyphroot Grove rare monsters.', text: 'Something is still growing inside.' },
    { id: 'grove-biting-mask', name: 'Biting Mask', slot: 'relic', minLevel: 5, source: 'Glyphroot Grove rare monsters.', text: 'It helps. It also judges.' },
    { id: 'grove-null-bark', name: 'Null Bark', slot: 'relic', minLevel: 7, source: 'Glyphroot Grove rare monsters and cursed Forge rolls.', text: 'A tree forgot itself.' },
    { id: 'grove-first-root', name: 'First Root', slot: 'relic', minLevel: 9, source: 'Very rare Glyphroot Grove discovery.', text: 'A relic from before the map had edges.' },
    { id: 'grove-dealer-leaf', name: 'Dealer Leaf', slot: 'relic', minLevel: 10, source: 'Very rare Glyphroot Grove discovery.', text: 'It whispers: one more run.' }
  ],
  'rust-mine': [
    { id: 'mine-iron-blade', name: 'Iron Blade', slot: 'weapon', minLevel: 8, source: 'Rust Mine fights and Forge after Area 2.', text: 'Simple iron. Very persuasive.' },
    { id: 'mine-drill-spear', name: 'Drill Spear', slot: 'weapon', minLevel: 9, source: 'Rust Mine fights and Forge after Area 2.', text: 'Made to open enemies and walls.' },
    { id: 'mine-rust-hammer', name: 'Rust Hammer', slot: 'weapon', minLevel: 10, source: 'Rust Mine fights and Forge after Area 2.', text: 'Heavy enough to be an argument.' },
    { id: 'mine-ore-staff', name: 'Ore Staff', slot: 'weapon', minLevel: 11, source: 'Rust Mine fights and Forge after Area 2.', text: 'A staff with mineral patience.' },
    { id: 'mine-coal-scythe', name: 'Coal Scythe', slot: 'weapon', minLevel: 12, source: 'Rust Mine rare monsters.', text: 'Cuts like a cave-in.' },
    { id: 'mine-rust-mail', name: 'Rust Mail', slot: 'armor', minLevel: 8, source: 'Rust Mine fights and Forge after Area 2.', text: 'Bad looking. Good blocking.' },
    { id: 'mine-ore-plate', name: 'Ore Plate', slot: 'armor', minLevel: 9, source: 'Rust Mine fights and Forge after Area 2.', text: 'Still has rocks in it.' },
    { id: 'mine-deep-coat', name: 'Deep Coat', slot: 'armor', minLevel: 10, source: 'Rust Mine fights and Forge after Area 2.', text: 'Keeps dust outside and fear inside.' },
    { id: 'mine-crystal-guard', name: 'Crystal Guard', slot: 'armor', minLevel: 14, source: 'Rust Mine rare gather and Forge.', text: 'Reflects tiny disasters.' },
    { id: 'mine-iron-shell', name: 'Iron Shell', slot: 'armor', minLevel: 16, source: 'Rust Mine rare monsters.', text: 'Moving is optional.' },
    { id: 'mine-miner-bell', name: 'Miner Bell', slot: 'charm', minLevel: 8, source: 'Rust Mine fights and Forge after Area 2.', text: 'Rings before danger arrives.' },
    { id: 'mine-lucky-nail', name: 'Lucky Nail', slot: 'charm', minLevel: 10, source: 'Rust Mine fights and Forge after Area 2.', text: 'Bent in the correct direction.' },
    { id: 'mine-ore-loop', name: 'Ore Loop', slot: 'charm', minLevel: 12, source: 'Rust Mine fights and Forge after Area 2.', text: 'A loop heavier than it looks.' },
    { id: 'mine-crystal-eye', name: 'Crystal Eye', slot: 'charm', minLevel: 15, source: 'Rust Mine rare gather and Forge.', text: 'Sees small chances.' },
    { id: 'mine-black-coin', name: 'Black Coin', slot: 'charm', minLevel: 18, source: 'Rust Mine rare monsters.', text: 'Always lands on regret.' },
    { id: 'mine-ore-mirror', name: 'Ore Mirror', slot: 'relic', minLevel: 10, source: 'Rust Mine rare monsters.', text: 'Shows a version of you with better gear.' },
    { id: 'mine-cave-key', name: 'Cave Key', slot: 'relic', minLevel: 12, source: 'Rust Mine rare monsters.', text: 'No door admits owning it.' },
    { id: 'mine-cracked-core', name: 'Cracked Core', slot: 'relic', minLevel: 14, source: 'Rust Mine rare monsters.', text: 'Still warm.' },
    { id: 'mine-debt-iron', name: 'Debt of Iron', slot: 'relic', minLevel: 16, source: 'Very rare Rust Mine discovery.', text: 'The mine wants it back.' },
    { id: 'mine-zero-mask', name: 'Zero Mask', slot: 'relic', minLevel: 18, source: 'Very rare Rust Mine discovery.', text: 'It counts down quietly.' }
  ],
  'sunken-library': [
    { id: 'library-ink-blade', name: 'Ink Blade', slot: 'weapon', minLevel: 15, source: 'Sunken Library fights and Forge after Area 3.', text: 'A blade written into existence.' },
    { id: 'library-red-pen', name: 'Red Pen', slot: 'weapon', minLevel: 16, source: 'Sunken Library fights and Forge after Area 3.', text: 'Edits monsters aggressively.' },
    { id: 'library-page-staff', name: 'Page Staff', slot: 'weapon', minLevel: 17, source: 'Sunken Library fights and Forge after Area 3.', text: 'Every hit cites a source.' },
    { id: 'library-silent-saber', name: 'Silent Saber', slot: 'weapon', minLevel: 20, source: 'Sunken Library rare monsters.', text: 'Cuts without a sound effect.' },
    { id: 'library-null-wand', name: 'Null Wand', slot: 'weapon', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Deletes part of the target and part of your confidence.' },
    { id: 'library-paper-mail', name: 'Paper Mail', slot: 'armor', minLevel: 15, source: 'Sunken Library fights and Forge after Area 3.', text: 'Stronger than it should be.' },
    { id: 'library-ink-cloak', name: 'Ink Cloak', slot: 'armor', minLevel: 16, source: 'Sunken Library fights and Forge after Area 3.', text: 'Stains incoming damage.' },
    { id: 'library-margin-guard', name: 'Margin Guard', slot: 'armor', minLevel: 18, source: 'Sunken Library fights and Forge after Area 3.', text: 'Nothing crosses the margin.' },
    { id: 'library-redacted-plate', name: 'Redacted Plate', slot: 'armor', minLevel: 22, source: 'Sunken Library rare monsters.', text: 'The weak spots were removed.' },
    { id: 'library-index-shell', name: 'Index Shell', slot: 'armor', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Catalogued and reinforced.' },
    { id: 'library-bookmark', name: 'Bookmark', slot: 'charm', minLevel: 15, source: 'Sunken Library fights and Forge after Area 3.', text: 'Saves your place in a bad timeline.' },
    { id: 'library-black-thread', name: 'Black Thread', slot: 'charm', minLevel: 16, source: 'Sunken Library fights and Forge after Area 3.', text: 'Ties luck to ink.' },
    { id: 'library-footnote-eye', name: 'Footnote Eye', slot: 'charm', minLevel: 18, source: 'Sunken Library fights and Forge after Area 3.', text: 'Important, tiny, easy to miss.' },
    { id: 'library-scribe-coin', name: 'Scribe Coin', slot: 'charm', minLevel: 21, source: 'Sunken Library rare monsters.', text: 'Pays debts written before you existed.' },
    { id: 'library-lost-sign', name: 'Lost Sign', slot: 'charm', minLevel: 24, source: 'Very rare Sunken Library discovery.', text: 'Points toward missing loot.' },
    { id: 'library-redacted-memory', name: 'Redacted Memory', slot: 'relic', minLevel: 17, source: 'Sunken Library rare monsters.', text: 'You remember equipping it before.' },
    { id: 'library-null-page', name: 'Null Page', slot: 'relic', minLevel: 19, source: 'Sunken Library rare monsters.', text: 'A page that refuses to be read.' },
    { id: 'library-oracle-mask', name: 'Oracle Mask', slot: 'relic', minLevel: 21, source: 'Sunken Library rare monsters.', text: 'Sees drops before they disappoint you.' },
    { id: 'library-last-refund', name: 'The Last Refund', slot: 'relic', minLevel: 23, source: 'Very rare Sunken Library discovery.', text: 'The Dealer hates this one.' },
    { id: 'library-prayer-exe', name: 'Prayer.exe', slot: 'relic', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Runs when everything else fails.' }
  ]
};

const areaMaterials: Record<AreaId, string[]> = {
  'glyphroot-grove': ['glyphroot', 'bark', 'wood'],
  'rust-mine': ['iron', 'crystal', 'wood'],
  'sunken-library': ['pages', 'ink', 'nullscrap']
};

export const starterWeapon = makeFixedItem({
  catalogId: 'grove-splinter-knife',
  templateId: 'starter-splinter-blade',
  name: 'Splinter Blade',
  slot: 'weapon',
  level: 1,
  rarity: 'normal',
  power: 3,
  text: 'A broken edge tied to a readable handle.',
  source: 'Starter item.'
});

export const starterArmor = makeFixedItem({
  catalogId: 'grove-patched-cloak',
  templateId: 'starter-patched-cloak',
  name: 'Patched Cloak',
  slot: 'armor',
  level: 1,
  rarity: 'normal',
  power: 1,
  text: 'Enough cloth to survive the first bad idea.',
  source: 'Starter item.'
});

export function rollForgeStock(area: AreaId, count = 4): Item[] {
  return Array.from({ length: count }, () => {
    const sourceArea = pickForgeArea(area);
    return generateForgeItem(sourceArea);
  });
}

export function generateLootItem(area: AreaId): Item {
  return generateItem(area, rollLootRarity(area));
}

export function generateForgeItem(area: AreaId): Item {
  return generateItem(area, rollForgeRarity(area));
}

function rollLootRarity(area: AreaId): Rarity {
  const value = Math.random();

  if (area === 'glyphroot-grove') {
    if (value < 0.006) return 'epic';
    if (value < 0.04) return 'rare';
    return 'normal';
  }

  if (area === 'rust-mine') {
    if (value < 0.0015) return 'legendary';
    if (value < 0.025) return 'epic';
    if (value < 0.14) return 'rare';
    return 'normal';
  }

  if (value < 0.002) return 'unique';
  if (value < 0.012) return 'legendary';
  if (value < 0.055) return 'epic';
  if (value < 0.19) return 'rare';
  return 'normal';
}

export function rollForgeRarity(area: AreaId): Rarity {
  const value = Math.random();

  if (area === 'glyphroot-grove') {
    if (value < 0.78) return 'normal';
    if (value < 0.95) return 'rare';
    return 'epic';
  }

  if (area === 'rust-mine') {
    if (value < 0.68) return 'normal';
    if (value < 0.88) return 'rare';
    if (value < 0.985) return 'epic';
    return 'legendary';
  }

  if (value < 0.58) return 'normal';
  if (value < 0.8) return 'rare';
  if (value < 0.95) return 'epic';
  if (value < 0.992) return 'legendary';
  return 'unique';
}

function pickForgeArea(area: AreaId): AreaId {
  if (area === 'glyphroot-grove') {
    return 'glyphroot-grove';
  }

  if (area === 'rust-mine') {
    return Math.random() < 0.75 ? 'rust-mine' : 'glyphroot-grove';
  }

  if (area === 'sunken-library') {
    const value = Math.random();

    if (value < 0.62) return 'sunken-library';
    if (value < 0.86) return 'rust-mine';
    return 'glyphroot-grove';
  }

  return 'glyphroot-grove';
}

function rollRarity(boost: Partial<Record<Rarity, number>>): Rarity {
  const value = Math.random();
  const unique = boost.unique ?? 0.005;
  const legendary = boost.legendary ?? 0.025;
  const epic = boost.epic ?? 0.07;
  const rare = boost.rare ?? 0.1;

  if (value < unique) return 'unique';
  if (value < unique + legendary) return 'legendary';
  if (value < unique + legendary + epic) return 'epic';
  if (value < unique + legendary + epic + rare) return 'rare';
  return 'normal';
}

function generateItem(area: AreaId, rarity: Rarity): Item {
  const entries = itemCatalogByArea[area].filter((entry) => catalogRarity(entry, area) === rarity);
  const fallbackEntries = itemCatalogByArea[area].filter((entry) => catalogRarity(entry, area) === 'normal');
  const entry = pick(entries.length ? entries : fallbackEntries);
  const config = rarityConfig[rarity];
  const levelRange = levelRangeFor(area);
  const level = between(Math.max(levelRange.min, entry.minLevel), levelRange.max);
  const data = slots[entry.slot];
  const displayName = rarity === 'unique' ? uniqueName(entry.name) : `${rarityPrefix(rarity)} ${entry.name}`.trim();
  const power = Math.max(1, Math.floor((level + basePowerFor(entry.slot)) * config.multiplier + between(0, Math.max(1, level >> 2))));
  const stats = statsFor(entry.slot, power, rarity);
  const cost = {
    gold: Math.floor((35 + level * 13 + power * 18) * config.cost),
    materials: costMaterialsFor(area, rarity, level)
  };

  return {
    id: `${rarity}-${entry.slot}-${slug(displayName)}-${Date.now()}-${Math.floor(Math.random() * 999999)}`,
    templateId: `${rarity}-${entry.id}`,
    catalogId: entry.id,
    name: displayName,
    glyph: data.glyph,
    slot: entry.slot,
    level,
    power,
    stats,
    rarity,
    text: `${rarityConfig[rarity].label} ${entry.slot}. ${entry.text}`,
    source: entry.source,
    art: artFor(entry, data.art, rarity),
    cost
  };
}

function costMaterialsFor(area: AreaId, rarity: Rarity, level: number): Partial<Record<string, number>> {
  const config = rarityConfig[rarity];
  const [main, rare, backup] = areaMaterials[area];
  const materials: Partial<Record<string, number>> = {
    [main]: Math.max(1, Math.floor(config.materials + level * (rarity === 'normal' ? 0.15 : 0.45)))
  };

  if (rarity !== 'normal') {
    materials[rare] = Math.max(1, Math.floor(config.materials * 0.75));
  }

  if (rarity === 'epic' || rarity === 'legendary' || rarity === 'unique') {
    materials[backup] = Math.max(1, Math.floor(config.materials * 0.6));
    materials.nullscrap = rarity === 'epic' ? 1 : rarity === 'legendary' ? 3 : 7;
  }

  return materials;
}

function makeFixedItem(input: {
  catalogId: string;
  templateId: string;
  name: string;
  slot: ItemSlot;
  level: number;
  rarity: Rarity;
  power: number;
  text: string;
  source: string;
}): Item {
  const data = slots[input.slot];

  return {
    id: input.templateId,
    templateId: input.templateId,
    catalogId: input.catalogId,
    name: input.name,
    glyph: data.glyph,
    slot: input.slot,
    level: input.level,
    power: input.power,
    stats: statsFor(input.slot, input.power, input.rarity),
    rarity: input.rarity,
    text: input.text,
    source: input.source,
    art: data.art,
    cost: { gold: 0, materials: {} }
  };
}

function statsFor(slot: ItemSlot, power: number, rarity: Rarity) {
  const bonus = rarityConfig[rarity].statRolls;
  const random = () => bonus ? between(0, bonus + 1) : 0;

  if (slot === 'weapon') return { attack: power + random(), defense: 0, luck: random() };
  if (slot === 'armor') return { attack: 0, defense: power + random(), luck: 0 };
  if (slot === 'charm') return { attack: Math.ceil(power * 0.55) + random(), defense: 0, luck: power + random() };
  return { attack: Math.ceil(power * 0.7) + random(), defense: Math.ceil(power * 0.45) + random(), luck: random() };
}

function levelRangeFor(area: AreaId) {
  if (area === 'glyphroot-grove') return { min: 1, max: 20 };
  if (area === 'rust-mine') return { min: 8, max: 35 };
  return { min: 15, max: 50 };
}

function basePowerFor(slot: ItemSlot): number {
  if (slot === 'weapon') return 2;
  if (slot === 'armor') return 1;
  if (slot === 'charm') return 0;
  return 3;
}

function rarityPrefix(rarity: Rarity): string {
  if (rarity === 'normal') return '';
  if (rarity === 'rare') return pick(['Sharp', 'Stable', 'Carved', 'Bright', 'Lucky']);
  if (rarity === 'epic') return pick(['Ancient', 'Runed', 'Echoing', 'Fractured', 'Gilded']);
  if (rarity === 'legendary') return pick(['Mythic', 'Starforged', 'Forgotten', 'Oracle', 'Bloodmarked']);
  return '';
}

function uniqueName(name: string): string {
  return pick([
    `The First ${name}`,
    `${name} of Static`,
    `${name} Zero`,
    `The Dealer's ${name}`,
    `Null-Touched ${name}`
  ]);
}

function artFor(entry: ItemCatalogEntry, fallback: string, rarity: Rarity): string {
  const base = entry.art ?? fallback;

  if (rarity === 'unique') return base.replace(']', '✦]');
  if (rarity === 'legendary') return base.replace(']', '*]');
  if (rarity === 'epic') return base.replace(']', '+]');
  return base;
}

export function cloneItem(item: Item): Item {
  return structuredClone({
    ...item,
    id: `${item.templateId}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
  });
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function rarityLabel(rarity: Rarity): string {
  return rarityConfig[rarity].label;
}

export const rarityList = rarityOrder;
