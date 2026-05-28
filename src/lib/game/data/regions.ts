import type { AreaId, RegionId, SystemId, WorldNodeId } from '../types/game';

export type RegionDefinition = {
  id: RegionId;
  name: string;
  levelMin: number;
  levelMax: number;
  boss: string;
  bossEnemyId: string;
  bossNodeId: WorldNodeId;
  villageNodeId: WorldNodeId;
  forgeTier: number;
  areas: AreaId[];
  unlocks: SystemId[];
};

export const regions: RegionDefinition[] = [
  {
    id: 1,
    name: 'The Broken Frontier',
    levelMin: 1,
    levelMax: 20,
    boss: 'The Watcher',
    bossEnemyId: 'watcher',
    bossNodeId: 'watcher-gate',
    villageNodeId: 'village',
    forgeTier: 1,
    areas: [
      'glyphroot-grove',
      'rust-mine',
      'sunken-library'
    ],
    unlocks: []
  },
  {
    id: 2,
    name: 'Ashen Depths',
    levelMin: 20,
    levelMax: 40,
    boss: 'The Hollow King',
    bossEnemyId: 'hollow-king',
    bossNodeId: 'hollow-gate',
    villageNodeId: 'ashen-refuge',
    forgeTier: 2,
    areas: [
      'obsidian-pit',
      'ashen-cathedral',
      'void-archives'
    ],
    unlocks: [
      'mine',
      'enchantments'
    ]
  }
];

export const regionById = Object.fromEntries(
  regions.map((region) => [region.id, region])
) as Record<RegionId, RegionDefinition>;

export const regionAreaOrder = Object.fromEntries(
  regions.map((region) => [region.id, region.areas])
) as Record<RegionId, AreaId[]>;

export const allAreaOrder = regions.flatMap((region) => region.areas);

export function regionForArea(area: AreaId): RegionId {
  return regions.find((region) => region.areas.includes(area))?.id ?? 1;
}
