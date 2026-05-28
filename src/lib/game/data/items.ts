import type { AreaId, Item, ItemSlot, Rarity } from '../types/game';

export type ItemCatalogEntry = {
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
  rare: { label: 'Rare', multiplier: 1.24, cost: 2.1, materials: 2, statRolls: 1 },
  epic: { label: 'Epic', multiplier: 1.52, cost: 4.2, materials: 3, statRolls: 2 },
  legendary: { label: 'Legendary', multiplier: 2, cost: 10, materials: 6, statRolls: 3 },
  unique: { label: 'Unique', multiplier: 2.8, cost: 18, materials: 8, statRolls: 4 }
};

const slots: Record<ItemSlot, {
  glyph: string;
  art: string;
  text: string;
}> = {
  weapon: { glyph: '/', art: '[ / ]', text: 'Main attack item. If combat feels slow, upgrade this first.' },
  armor: { glyph: '#', art: '[ # ]', text: 'Main defense item. If you keep dying, get better armor.' },
  charm: { glyph: 'o', art: '[ o ]', text: 'Small bonus item. Good for attack and luck.' },
  relic: { glyph: 'x', art: '[ x ]', text: 'Rare power item. Usually expensive, sometimes absurd.' }
};

export const areaNames: Record<AreaId, string> = {
  'glyphroot-grove': 'Glyphroot Grove',
  'rust-mine': 'Rust Mine',
  'sunken-library': 'Sunken Library',
  'obsidian-pit': 'Obsidian Pit',
  'ashen-cathedral': 'Ashen Cathedral',
  'void-archives': 'Void Archives'
};

const explicitRarity: Partial<Record<string, Rarity>> = {
  'grove-green-eye': 'rare',
  'grove-root-coin': 'rare',
  'grove-null-bark': 'rare',
  'grove-first-root': 'epic',
  'grove-dealer-leaf': 'epic',
  'mine-crystal-guard': 'rare',
  'mine-iron-shell': 'rare',
  'mine-crystal-eye': 'rare',
  'mine-black-coin': 'rare',
  'mine-ore-mirror': 'rare',
  'mine-cave-key': 'rare',
  'mine-cracked-core': 'rare',
  'mine-debt-iron': 'epic',
  'mine-zero-mask': 'epic',
  'library-silent-saber': 'rare',
  'library-redacted-plate': 'rare',
  'library-scribe-coin': 'rare',
  'library-redacted-memory': 'rare',
  'library-null-page': 'rare',
  'library-null-wand': 'epic',
  'library-index-shell': 'epic',
  'library-lost-sign': 'epic',
  'library-oracle-mask': 'epic',
  'library-last-refund': 'epic',
  'library-prayer-exe': 'epic',
  'obsidian-glass-hook': 'rare',
  'obsidian-night-plate': 'rare',
  'obsidian-pit-eye': 'rare',
  'obsidian-black-core': 'epic',
  'cathedral-cinder-saber': 'rare',
  'cathedral-ember-mail': 'rare',
  'cathedral-choir-thread': 'rare',
  'cathedral-bell-zero': 'epic',
  'archives-null-blade': 'rare',
  'archives-erased-shell': 'rare',
  'archives-index-loop': 'rare',
  'archives-hollow-prayer': 'epic',
  'archives-king-sign': 'epic'
};

function catalogRarity(entry: ItemCatalogEntry): Rarity {
  return entry.rarity ?? explicitRarity[entry.id] ?? 'normal';
}

export const materialInfo: Record<string, {
  label: string;
  rarity: Rarity;
  source: string;
}> = {
  wood: { label: 'Wood', rarity: 'normal', source: 'Common Area 1 material from Glyphroot Grove.' },
  iron: { label: 'Iron', rarity: 'normal', source: 'Common Area 1 material from Rust Mine.' },
  pages: { label: 'Old Pages', rarity: 'normal', source: 'Common Area 1 material from Sunken Library.' },
  bark: { label: 'Living Bark', rarity: 'rare', source: 'Rare Area 1 material from gathering.' },
  crystal: { label: 'Fracture Crystal', rarity: 'rare', source: 'Rare Area 1 material from gathering.' },
  ink: { label: 'Black Ink', rarity: 'epic', source: 'Epic Area 1 material from gathering.' },
  obsidian: { label: 'Obsidian', rarity: 'normal', source: 'Common Area 2 material from Obsidian Pit.' },
  ember: { label: 'Ember Dust', rarity: 'normal', source: 'Common Area 2 material from Ashen Cathedral.' },
  script: { label: 'Burned Script', rarity: 'normal', source: 'Common Area 2 material from Void Archives.' },
  ash: { label: 'Living Ash', rarity: 'rare', source: 'Rare Area 2 material from gathering.' },
  cinder: { label: 'Cinder Glass', rarity: 'rare', source: 'Rare Area 2 material from gathering.' },
  hollow: { label: 'Hollow Core', rarity: 'epic', source: 'Epic Area 2 material from gathering and deep mine floors.' }
};

export const itemCatalogByArea: Record<AreaId, ItemCatalogEntry[]> = {
  'glyphroot-grove': [
    { id: 'grove-splinter-knife', name: 'Splinter Knife', slot: 'weapon', minLevel: 1, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'A quick starter blade from living wood.' },
    { id: 'grove-root-staff', name: 'Root Staff', slot: 'weapon', minLevel: 2, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'A branch that remembers where it hit.' },
    { id: 'grove-thorn-hook', name: 'Thorn Hook', slot: 'weapon', minLevel: 3, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Good at pulling bad ideas closer.' },
    { id: 'grove-bark-axe', name: 'Bark Axe', slot: 'weapon', minLevel: 4, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Ugly, sharp, reliable.' },
    { id: 'grove-green-wand', name: 'Green Wand', slot: 'weapon', minLevel: 5, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Not real magic yet, but close enough.' },
    { id: 'grove-patched-cloak', name: 'Patched Cloak', slot: 'armor', minLevel: 1, source: 'Starter/Glyphroot Grove.', text: 'Light cloth for early mistakes.' },
    { id: 'grove-bark-vest', name: 'Bark Vest', slot: 'armor', minLevel: 2, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'It bends before it breaks.' },
    { id: 'grove-moss-wrap', name: 'Moss Wrap', slot: 'armor', minLevel: 3, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Smells safe. Probably safe.' },
    { id: 'grove-hollow-guard', name: 'Hollow Guard', slot: 'armor', minLevel: 5, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'A piece of tree pretending to be armor.' },
    { id: 'grove-root-mail', name: 'Root Mail', slot: 'armor', minLevel: 7, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Roots knit themselves tighter when hit.' },
    { id: 'grove-tiny-loop', name: 'Tiny Loop', slot: 'charm', minLevel: 1, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Small luck. Small price. Small addiction.' },
    { id: 'grove-sap-charm', name: 'Sap Charm', slot: 'charm', minLevel: 2, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Sticky fortune.' },
    { id: 'grove-wild-knot', name: 'Wild Knot', slot: 'charm', minLevel: 3, source: 'Area 1 / Glyphroot Grove fights and Forge.', text: 'Nobody knows how to untie it.' },
    { id: 'grove-green-eye', name: 'Green Eye', slot: 'charm', minLevel: 6, source: 'Glyphroot Grove rare monsters.', text: 'It blinks when loot is near.' },
    { id: 'grove-root-coin', name: 'Root Coin', slot: 'charm', minLevel: 8, source: 'Glyphroot Grove rare monsters and Forge.', text: 'The Dealer refuses to touch it.' },
    { id: 'grove-old-seed', name: 'Old Seed', slot: 'relic', minLevel: 4, source: 'Glyphroot Grove rare monsters.', text: 'Something is still growing inside.' },
    { id: 'grove-biting-mask', name: 'Biting Mask', slot: 'relic', minLevel: 5, source: 'Glyphroot Grove rare monsters.', text: 'It helps. It also judges.' },
    { id: 'grove-null-bark', name: 'Null Bark', slot: 'relic', minLevel: 7, source: 'Glyphroot Grove rare monsters and cursed Forge rolls.', text: 'A tree forgot itself.' },
    { id: 'grove-first-root', name: 'First Root', slot: 'relic', minLevel: 9, source: 'Very rare Glyphroot Grove discovery.', text: 'A relic from before the map had edges.' },
    { id: 'grove-dealer-leaf', name: 'Dealer Leaf', slot: 'relic', minLevel: 10, source: 'Very rare Glyphroot Grove discovery.', text: 'It whispers: one more run.' }
  ],
  'rust-mine': [
    { id: 'mine-iron-blade', name: 'Iron Blade', slot: 'weapon', minLevel: 8, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Simple iron. Very persuasive.' },
    { id: 'mine-drill-spear', name: 'Drill Spear', slot: 'weapon', minLevel: 9, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Made to open enemies and walls.' },
    { id: 'mine-rust-hammer', name: 'Rust Hammer', slot: 'weapon', minLevel: 10, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Heavy enough to be an argument.' },
    { id: 'mine-ore-staff', name: 'Ore Staff', slot: 'weapon', minLevel: 11, source: 'Area 1 / Rust Mine fights and Forge.', text: 'A staff with mineral patience.' },
    { id: 'mine-coal-scythe', name: 'Coal Scythe', slot: 'weapon', minLevel: 12, source: 'Rust Mine rare monsters.', text: 'Cuts like a cave-in.' },
    { id: 'mine-rust-mail', name: 'Rust Mail', slot: 'armor', minLevel: 8, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Bad looking. Good blocking.' },
    { id: 'mine-ore-plate', name: 'Ore Plate', slot: 'armor', minLevel: 9, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Still has rocks in it.' },
    { id: 'mine-deep-coat', name: 'Deep Coat', slot: 'armor', minLevel: 10, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Keeps dust outside and fear inside.' },
    { id: 'mine-crystal-guard', name: 'Crystal Guard', slot: 'armor', minLevel: 14, source: 'Rust Mine rare monsters and Forge.', text: 'Reflects tiny disasters.' },
    { id: 'mine-iron-shell', name: 'Iron Shell', slot: 'armor', minLevel: 16, source: 'Rust Mine rare monsters.', text: 'Moving is optional.' },
    { id: 'mine-miner-bell', name: 'Miner Bell', slot: 'charm', minLevel: 8, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Rings before danger arrives.' },
    { id: 'mine-lucky-nail', name: 'Lucky Nail', slot: 'charm', minLevel: 10, source: 'Area 1 / Rust Mine fights and Forge.', text: 'Bent in the correct direction.' },
    { id: 'mine-ore-loop', name: 'Ore Loop', slot: 'charm', minLevel: 12, source: 'Area 1 / Rust Mine fights and Forge.', text: 'A loop heavier than it looks.' },
    { id: 'mine-crystal-eye', name: 'Crystal Eye', slot: 'charm', minLevel: 15, source: 'Rust Mine rare monsters and Forge.', text: 'Sees small chances.' },
    { id: 'mine-black-coin', name: 'Black Coin', slot: 'charm', minLevel: 18, source: 'Rust Mine rare monsters.', text: 'Always lands on regret.' },
    { id: 'mine-ore-mirror', name: 'Ore Mirror', slot: 'relic', minLevel: 10, source: 'Rust Mine rare monsters.', text: 'Shows a version of you with better gear.' },
    { id: 'mine-cave-key', name: 'Cave Key', slot: 'relic', minLevel: 12, source: 'Rust Mine rare monsters.', text: 'No door admits owning it.' },
    { id: 'mine-cracked-core', name: 'Cracked Core', slot: 'relic', minLevel: 14, source: 'Rust Mine rare monsters.', text: 'Still warm.' },
    { id: 'mine-debt-iron', name: 'Debt of Iron', slot: 'relic', minLevel: 16, source: 'Very rare Rust Mine discovery.', text: 'The mine wants it back.' },
    { id: 'mine-zero-mask', name: 'Zero Mask', slot: 'relic', minLevel: 18, source: 'Very rare Rust Mine discovery.', text: 'It counts down quietly.' }
  ],
  'sunken-library': [
    { id: 'library-ink-blade', name: 'Ink Blade', slot: 'weapon', minLevel: 15, source: 'Area 1 / Sunken Library fights and Forge.', text: 'A blade written into existence.' },
    { id: 'library-red-pen', name: 'Red Pen', slot: 'weapon', minLevel: 16, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Edits monsters aggressively.' },
    { id: 'library-page-staff', name: 'Page Staff', slot: 'weapon', minLevel: 17, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Every hit cites a source.' },
    { id: 'library-silent-saber', name: 'Silent Saber', slot: 'weapon', minLevel: 20, source: 'Sunken Library rare monsters.', text: 'Cuts without a sound effect.' },
    { id: 'library-null-wand', name: 'Null Wand', slot: 'weapon', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Deletes part of the target and part of your confidence.' },
    { id: 'library-paper-mail', name: 'Paper Mail', slot: 'armor', minLevel: 15, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Stronger than it should be.' },
    { id: 'library-ink-cloak', name: 'Ink Cloak', slot: 'armor', minLevel: 16, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Stains incoming damage.' },
    { id: 'library-margin-guard', name: 'Margin Guard', slot: 'armor', minLevel: 18, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Nothing crosses the margin.' },
    { id: 'library-redacted-plate', name: 'Redacted Plate', slot: 'armor', minLevel: 22, source: 'Sunken Library rare monsters.', text: 'The weak spots were removed.' },
    { id: 'library-index-shell', name: 'Index Shell', slot: 'armor', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Catalogued and reinforced.' },
    { id: 'library-bookmark', name: 'Bookmark', slot: 'charm', minLevel: 15, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Saves your place in a bad timeline.' },
    { id: 'library-black-thread', name: 'Black Thread', slot: 'charm', minLevel: 16, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Ties luck to ink.' },
    { id: 'library-footnote-eye', name: 'Footnote Eye', slot: 'charm', minLevel: 18, source: 'Area 1 / Sunken Library fights and Forge.', text: 'Important, tiny, easy to miss.' },
    { id: 'library-scribe-coin', name: 'Scribe Coin', slot: 'charm', minLevel: 21, source: 'Sunken Library rare monsters.', text: 'Pays debts written before you existed.' },
    { id: 'library-lost-sign', name: 'Lost Sign', slot: 'charm', minLevel: 24, source: 'Very rare Sunken Library discovery.', text: 'Points toward missing loot.' },
    { id: 'library-redacted-memory', name: 'Redacted Memory', slot: 'relic', minLevel: 17, source: 'Sunken Library rare monsters.', text: 'You remember equipping it before.' },
    { id: 'library-null-page', name: 'Null Page', slot: 'relic', minLevel: 19, source: 'Sunken Library rare monsters.', text: 'A page that refuses to be read.' },
    { id: 'library-oracle-mask', name: 'Oracle Mask', slot: 'relic', minLevel: 21, source: 'Sunken Library rare monsters.', text: 'Sees drops before they disappoint you.' },
    { id: 'library-last-refund', name: 'The Last Refund', slot: 'relic', minLevel: 23, source: 'Very rare Sunken Library discovery.', text: 'The Dealer hates this one.' },
    { id: 'library-prayer-exe', name: 'Prayer.exe', slot: 'relic', minLevel: 25, source: 'Very rare Sunken Library discovery.', text: 'Runs when everything else fails.' }
  ],
  'obsidian-pit': [
    { id: 'obsidian-pit-knife', name: 'Pit Knife', slot: 'weapon', minLevel: 20, source: 'Area 2 / Obsidian Pit fights and Forge.', text: 'A black glass blade that remembers heat.' },
    { id: 'obsidian-crack-spear', name: 'Crack Spear', slot: 'weapon', minLevel: 22, source: 'Area 2 / Obsidian Pit fights and Forge.', text: 'Long, brittle, and mean.' },
    { id: 'obsidian-glass-hook', name: 'Glass Hook', slot: 'weapon', minLevel: 25, source: 'Obsidian Pit rare monsters and Forge.', text: 'Pulls enemies through sharp reflections.' },
    { id: 'obsidian-pit-vest', name: 'Pit Vest', slot: 'armor', minLevel: 20, source: 'Area 2 / Obsidian Pit fights and Forge.', text: 'Warm armor from a cold hole.' },
    { id: 'obsidian-night-plate', name: 'Night Plate', slot: 'armor', minLevel: 26, source: 'Obsidian Pit rare monsters.', text: 'Light disappears across its surface.' },
    { id: 'obsidian-ash-loop', name: 'Ash Loop', slot: 'charm', minLevel: 21, source: 'Area 2 / Obsidian Pit fights and Forge.', text: 'Loops luck through smoke.' },
    { id: 'obsidian-pit-eye', name: 'Pit Eye', slot: 'charm', minLevel: 25, source: 'Obsidian Pit rare monsters.', text: 'Sees the next floor before you do.' },
    { id: 'obsidian-black-core', name: 'Black Core', slot: 'relic', minLevel: 28, source: 'Very rare Obsidian Pit discovery.', text: 'A heart-shaped mistake.' }
  ],
  'ashen-cathedral': [
    { id: 'cathedral-ember-mace', name: 'Ember Mace', slot: 'weapon', minLevel: 27, source: 'Area 2 / Ashen Cathedral fights and Forge.', text: 'Heavy faith, hotter handle.' },
    { id: 'cathedral-cinder-saber', name: 'Cinder Saber', slot: 'weapon', minLevel: 31, source: 'Ashen Cathedral rare monsters.', text: 'A clean cut that leaves ash.' },
    { id: 'cathedral-ash-cloak', name: 'Ash Cloak', slot: 'armor', minLevel: 27, source: 'Area 2 / Ashen Cathedral fights and Forge.', text: 'Smoke curls away from impact.' },
    { id: 'cathedral-ember-mail', name: 'Ember Mail', slot: 'armor', minLevel: 32, source: 'Ashen Cathedral rare monsters and Forge.', text: 'Glows when danger gets close.' },
    { id: 'cathedral-prayer-coin', name: 'Prayer Coin', slot: 'charm', minLevel: 28, source: 'Area 2 / Ashen Cathedral fights and Forge.', text: 'A coin spent by nobody alive.' },
    { id: 'cathedral-choir-thread', name: 'Choir Thread', slot: 'charm', minLevel: 33, source: 'Ashen Cathedral rare monsters.', text: 'Ties luck to a silent choir.' },
    { id: 'cathedral-bell-zero', name: 'Bell Zero', slot: 'relic', minLevel: 35, source: 'Very rare Ashen Cathedral discovery.', text: 'It rings once when your build is wrong.' }
  ],
  'void-archives': [
    { id: 'archives-ink-cleaver', name: 'Ink Cleaver', slot: 'weapon', minLevel: 34, source: 'Area 2 / Void Archives fights and Forge.', text: 'Cuts through written defenses.' },
    { id: 'archives-null-blade', name: 'Null Blade', slot: 'weapon', minLevel: 38, source: 'Void Archives rare monsters.', text: 'Part of the blade is missing on purpose.' },
    { id: 'archives-page-guard', name: 'Page Guard', slot: 'armor', minLevel: 34, source: 'Area 2 / Void Archives fights and Forge.', text: 'Every page blocks one bad ending.' },
    { id: 'archives-erased-shell', name: 'Erased Shell', slot: 'armor', minLevel: 39, source: 'Void Archives rare monsters and Forge.', text: 'The weak point was removed from the sentence.' },
    { id: 'archives-index-loop', name: 'Index Loop', slot: 'charm', minLevel: 36, source: 'Void Archives rare monsters.', text: 'Finds things you were not meant to farm.' },
    { id: 'archives-hollow-prayer', name: 'Hollow Prayer', slot: 'relic', minLevel: 40, source: 'Very rare Void Archives discovery.', text: 'Pray, then check the combat log.' },
    { id: 'archives-king-sign', name: 'King Sign', slot: 'relic', minLevel: 40, source: 'Very rare Void Archives discovery.', text: 'Points toward the second crown.' }
  ]
};

const areaMaterials: Record<AreaId, { main: string; rare: string; epic: string }> = {
  'glyphroot-grove': { main: 'wood', rare: 'bark', epic: 'ink' },
  'rust-mine': { main: 'iron', rare: 'crystal', epic: 'ink' },
  'sunken-library': { main: 'pages', rare: 'crystal', epic: 'ink' },
  'obsidian-pit': { main: 'obsidian', rare: 'ash', epic: 'hollow' },
  'ashen-cathedral': { main: 'ember', rare: 'cinder', epic: 'hollow' },
  'void-archives': { main: 'script', rare: 'cinder', epic: 'hollow' }
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
  return Array.from({ length: count }, () => generateForgeItem(area));
}

export function generateLootItem(area: AreaId): Item {
  return generateItem(area, rollLootRarity());
}

export function generateForgeItem(area: AreaId): Item {
  return generateItem(area, rollForgeRarity());
}

function rollLootRarity(): Rarity {
  const value = Math.random();

  if (value < 0.02) return 'epic';
  if (value < 0.14) return 'rare';

  return 'normal';
}

export function rollForgeRarity(): Rarity {
  const value = Math.random();

  if (value < 0.68) return 'normal';
  if (value < 0.9) return 'rare';

  return 'epic';
}

function generateItem(area: AreaId, rarity: Rarity): Item {
  const areaEntries = itemCatalogByArea[area];
  const entries = areaEntries.filter((entry) => catalogRarity(entry) === rarity);
  const fallbackEntries = areaEntries.filter((entry) => catalogRarity(entry) === 'normal');
  const entry = pick(entries.length ? entries : fallbackEntries.length ? fallbackEntries : areaEntries);
  const config = rarityConfig[rarity];
  const levelRange = levelRangeFor(area);
  const minLevel = Math.min(levelRange.max, Math.max(levelRange.min, entry.minLevel));
  const level = between(minLevel, levelRange.max);
  const data = slots[entry.slot];
  const displayName = rarity === 'unique' ? uniqueName(entry.name) : `${rarityPrefix(rarity)} ${entry.name}`.trim();
  const power = Math.max(1, Math.floor((level + basePowerFor(entry.slot)) * config.multiplier + between(0, Math.max(1, level >> 2))));
  const stats = statsFor(entry.slot, power, rarity);

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
    text: `${config.label} ${entry.slot}. ${entry.text}`,
    source: entry.source,
    art: artFor(entry, data.art, rarity),
    cost: {
      gold: Math.floor((35 + level * 12 + power * 16) * config.cost),
      materials: costMaterialsFor(area, rarity, level)
    }
  };
}

function costMaterialsFor(area: AreaId, rarity: Rarity, level: number): Partial<Record<string, number>> {
  const config = rarityConfig[rarity];
  const pool = areaMaterials[area];
  const areaScale = area.startsWith('obsidian') ? 3 : area.startsWith('ashen') ? 4 : area.startsWith('void') ? 5 : area === 'glyphroot-grove' ? 0 : area === 'rust-mine' ? 1 : 2;
  const mainCost = Math.max(1, Math.floor(config.materials + areaScale + level * 0.12));

  if (rarity === 'normal') {
    return { [pool.main]: mainCost };
  }

  if (rarity === 'rare') {
    return { [pool.main]: mainCost, [pool.rare]: Math.max(1, Math.floor(config.materials * 0.6)) };
  }

  return {
    [pool.main]: mainCost,
    [pool.rare]: Math.max(1, Math.floor(config.materials * 0.75)),
    [pool.epic]: Math.max(1, rarity === 'epic' ? 1 : Math.floor(config.materials * 0.5))
  };
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
  if (area === 'glyphroot-grove') return { min: 1, max: 8 };
  if (area === 'rust-mine') return { min: 7, max: 14 };
  if (area === 'sunken-library') return { min: 13, max: 20 };
  if (area === 'obsidian-pit') return { min: 20, max: 27 };
  if (area === 'ashen-cathedral') return { min: 27, max: 34 };
  return { min: 34, max: 40 };
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

export function itemStatSummary(item: Item): string {
  const values: Array<[string, number]> = [
    ['atk', item.stats.attack ?? 0],
    ['def', item.stats.defense ?? 0],
    ['luck', item.stats.luck ?? 0]
  ];

  return values
    .filter(([, value]) => value > 0)
    .map(([label, value]) => `+${value} ${label}`)
    .join(' / ');
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
