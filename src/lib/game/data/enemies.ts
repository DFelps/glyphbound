import type { AreaId, Enemy } from '../types/game';

export const enemies: Record<string, Enemy> = {
  rootling: {
    id: 'rootling',
    name: 'Rootling',
    glyph: 'r',
    hp: 14,
    maxHp: 14,
    attack: 3,
    defense: 0,
    xp: 6,
    gold: 8,
    area: 'glyphroot-grove',
    art: ['   &&', '  (oo)', '  /||\\'].join('\n')
  },
  thornBeast: {
    id: 'thorn-beast',
    name: 'Thorn Beast',
    glyph: 't',
    hp: 22,
    maxHp: 22,
    attack: 5,
    defense: 1,
    xp: 12,
    gold: 14,
    area: 'glyphroot-grove',
    art: ['  /\\/\\', ' ( xx )', '  \\__/'].join('\n')
  },
  mossRat: {
    id: 'moss-rat',
    name: 'Moss Rat',
    glyph: 'm',
    hp: 12,
    maxHp: 12,
    attack: 4,
    defense: 0,
    xp: 7,
    gold: 9,
    area: 'glyphroot-grove',
    art: ['  _.._', ' (o  o)', ' /_vv_\\'].join('\n')
  },
  barkImp: {
    id: 'bark-imp',
    name: 'Bark Imp',
    glyph: 'i',
    hp: 18,
    maxHp: 18,
    attack: 5,
    defense: 1,
    xp: 10,
    gold: 13,
    area: 'glyphroot-grove',
    art: ['  ^ ^', ' (..)', ' /||\\'].join('\n')
  },
  vineCrawler: {
    id: 'vine-crawler',
    name: 'Vine Crawler',
    glyph: 'v',
    hp: 24,
    maxHp: 24,
    attack: 6,
    defense: 1,
    xp: 14,
    gold: 17,
    area: 'glyphroot-grove',
    art: [' ~~~~~', '( o o)', ' \\___/'].join('\n')
  },
  hollowStump: {
    id: 'hollow-stump',
    name: 'Hollow Stump',
    glyph: 'h',
    hp: 32,
    maxHp: 32,
    attack: 5,
    defense: 3,
    xp: 16,
    gold: 19,
    area: 'glyphroot-grove',
    art: ['  ___', ' |o o|', ' |___|'].join('\n')
  },
  sapLeech: {
    id: 'sap-leech',
    name: 'Sap Leech',
    glyph: 'l',
    hp: 20,
    maxHp: 20,
    attack: 7,
    defense: 0,
    xp: 15,
    gold: 18,
    area: 'glyphroot-grove',
    art: ['  ____', ' / oo \\', ' \\_==_/'].join('\n')
  },
  glyphMoth: {
    id: 'glyph-moth',
    name: 'Glyph Moth',
    glyph: 'g',
    hp: 16,
    maxHp: 16,
    attack: 6,
    defense: 0,
    xp: 18,
    gold: 22,
    rare: true,
    area: 'glyphroot-grove',
    art: [' \\  /', ' (oo)', ' /__\\'].join('\n')
  },
  goldenRootling: {
    id: 'golden-rootling',
    name: 'Golden Rootling',
    glyph: 'R',
    hp: 26,
    maxHp: 26,
    attack: 6,
    defense: 2,
    xp: 30,
    gold: 80,
    rare: true,
    area: 'glyphroot-grove',
    art: ['   $$', '  (oo)', '  /||\\'].join('\n')
  },
  oldBarkKing: {
    id: 'old-bark-king',
    name: 'Old Bark King',
    glyph: 'K',
    hp: 52,
    maxHp: 52,
    attack: 10,
    defense: 5,
    xp: 80,
    gold: 140,
    rare: true,
    area: 'glyphroot-grove',
    art: ['  \\|||/', '  (Ø Ø)', '  /###\\'].join('\n')
  },
  mineCrawler: {
    id: 'mine-crawler',
    name: 'Mine Crawler',
    glyph: 'c',
    hp: 30,
    maxHp: 30,
    attack: 7,
    defense: 2,
    xp: 22,
    gold: 25,
    area: 'rust-mine',
    art: ['  /\\/\\', ' ( oo )', ' /_||_\\'].join('\n')
  },
  rustBandit: {
    id: 'rust-bandit',
    name: 'Rust Bandit',
    glyph: 'b',
    hp: 34,
    maxHp: 34,
    attack: 8,
    defense: 2,
    xp: 28,
    gold: 34,
    area: 'rust-mine',
    art: ['   o', '  /|\\', '  / \\'].join('\n')
  },
  oreMimic: {
    id: 'ore-mimic',
    name: 'Ore Mimic',
    glyph: 'M',
    hp: 60,
    maxHp: 60,
    attack: 13,
    defense: 5,
    xp: 95,
    gold: 130,
    rare: true,
    area: 'rust-mine',
    art: ['  _____', ' / ### \\', '| 0 0 |', ' \\_vv_/'].join('\n')
  },
  bookWraith: {
    id: 'book-wraith',
    name: 'Book Wraith',
    glyph: 'w',
    hp: 42,
    maxHp: 42,
    attack: 9,
    defense: 3,
    xp: 38,
    gold: 42,
    area: 'sunken-library',
    art: ['  .---.', ' /? ?\\', ' \\___/', '  /|\\'].join('\n')
  },
  nullScribe: {
    id: 'null-scribe',
    name: 'Null Scribe',
    glyph: 'n',
    hp: 48,
    maxHp: 48,
    attack: 10,
    defense: 4,
    xp: 48,
    gold: 55,
    area: 'sunken-library',
    art: ['  _____', ' | Ø Ø |', ' |__?__|', '   /|\\'].join('\n')
  },
  redactedSaint: {
    id: 'redacted-saint',
    name: 'Redacted Saint',
    glyph: '?',
    hp: 90,
    maxHp: 90,
    attack: 18,
    defense: 8,
    xp: 180,
    gold: 240,
    rare: true,
    area: 'sunken-library',
    art: ['  .---.', ' / ? ? \\', '|  ---  |', ' \\_____/', '   /|\\'].join('\n')
  },
  watcher: {
    id: 'the-watcher',
    name: 'The Watcher',
    glyph: 'Ø',
    hp: 130,
    maxHp: 130,
    attack: 15,
    defense: 6,
    xp: 180,
    gold: 240,
    boss: true,
    art: ['   _________', '  /  Ø   Ø  \\', ' |     ^     |', ' |  \\_____/  |', '  \\_________/', '      | |'].join('\n')
  }
};

export const enemiesByArea: Record<AreaId, string[]> = {
  'glyphroot-grove': [
    'rootling',
    'thornBeast',
    'mossRat',
    'barkImp',
    'vineCrawler',
    'hollowStump',
    'sapLeech',
    'glyphMoth',
    'goldenRootling',
    'oldBarkKing'
  ],
  'rust-mine': ['mineCrawler', 'rustBandit', 'oreMimic'],
  'sunken-library': ['bookWraith', 'nullScribe', 'redactedSaint']
};

export function cloneEnemy(id: keyof typeof enemies): Enemy {
  return structuredClone(enemies[id]);
}

export function enemyIdsForArea(area: AreaId): string[] {
  return enemiesByArea[area];
}
