export type ItemSlot = 'weapon' | 'armor' | 'charm' | 'relic';

export type Rarity = 'normal' | 'rare' | 'epic' | 'legendary' | 'unique';

export type ItemStats = {
  attack: number;
  defense: number;
  luck: number;
};

export type ItemCost = {
  gold: number;
  materials: Partial<Record<string, number>>;
};

export type Item = {
  id: string;
  templateId: string;
  name: string;
  glyph: string;
  slot: ItemSlot;
  level: number;
  power: number;
  stats: ItemStats;
  rarity: Rarity;
  text: string;
  source: string;
  art: string;
  cost: ItemCost;
  catalogId: string;
  expiresAt?: number;
};

export type Enemy = {
  id: string;
  name: string;
  glyph: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xp: number;
  gold: number;
  art: string;
  boss?: boolean;
  rare?: boolean;
  area?: AreaId;
};

export type WorldNodeId = 'village' | 'glyphroot-grove' | 'rust-mine' | 'sunken-library' | 'old-forge' | 'watcher-gate';

export type AreaId = 'glyphroot-grove' | 'rust-mine' | 'sunken-library';

export type NodeKind = 'town' | 'wilds' | 'forge' | 'boss';

export type ActionId =
  | 'rest'
  | 'go-grove'
  | 'go-mine'
  | 'go-library'
  | 'go-forge'
  | 'go-boss'
  | 'back-village'
  | 'fight'
  | 'gather'
  | 'challenge-boss';

export type NodeAction = {
  id: ActionId;
  label: string;
  help: string;
  cost?: number;
  needs?: Partial<Record<string, number>>;
  locked?: boolean;
};

export type WorldNode = {
  id: WorldNodeId;
  name: string;
  shortName: string;
  kind: NodeKind;
  danger: number;
  minLevel: number;
  maxLevel: number;
  art: string;
  description: string;
  actions: NodeAction[];
};

export type AreaProgress = {
  fights: number;
  gathered: number;
  cleared: boolean;
};

export type CombatState = {
  active: boolean;
  enemy: Enemy | null;
  tick: number;
  source: WorldNodeId;
};

export type GameNotice = {
  title: string;
  message: string;
  kind: 'victory' | 'defeat' | 'info';
};

export type WikiState = {
  items: Record<string, boolean>;
  enemies: Record<string, boolean>;
  rareEnemies: Record<string, boolean>;
};

export type ForgeState = {
  stock: Item[];
  lastRefreshAt: number;
  nextRefreshAt: number;
};

export type Player = {
  name: string;
  glyph: '@';
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  nextLevel: number;
  gold: number;
  inventory: Item[];
  equipment: Partial<Record<ItemSlot, Item>>;
  materials: Record<string, number>;
};

export type GameState = {
  version: number;
  location: WorldNodeId;
  player: Player;
  combat: CombatState;
  areaProgress: Record<AreaId, AreaProgress>;
  bossUnlocked: boolean;
  bossDefeated: boolean;
  notice: GameNotice | null;
  forge: ForgeState;
  wiki: WikiState;
  log: string[];
};
