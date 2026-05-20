import type { Area, Entity, Point } from '../types/game';
import { cloneEnemy } from './enemies';

function border(width: number, height: number): Point[] {
  const points: Point[] = [];

  for (let x = 0; x < width; x += 1) {
    points.push({ x, y: 0 });
    points.push({ x, y: height - 1 });
  }

  for (let y = 1; y < height - 1; y += 1) {
    points.push({ x: 0, y });
    points.push({ x: width - 1, y });
  }

  return points;
}

function enemy(id: string, x: number, y: number, enemyId: Parameters<typeof cloneEnemy>[0]): Entity {
  const mob = cloneEnemy(enemyId);

  return {
    id,
    kind: mob.boss ? 'boss' : 'enemy',
    glyph: mob.glyph,
    position: { x, y },
    enemy: mob
  };
}

export const areas: Record<string, Area> = {
  'fracture-village': {
    id: 'fracture-village',
    name: 'Fracture Village',
    width: 14,
    height: 10,
    spawn: { x: 3, y: 4 },
    checkpoint: { x: 3, y: 4 },
    walls: [
      ...border(14, 10),
      { x: 6, y: 2 },
      { x: 6, y: 3 },
      { x: 6, y: 4 },
      { x: 10, y: 6 }
    ],
    entities: [
      {
        id: 'dealer',
        kind: 'merchant',
        glyph: '$',
        label: 'The Dealer',
        position: { x: 9, y: 3 }
      },
      {
        id: 'village-checkpoint',
        kind: 'checkpoint',
        glyph: '+',
        label: 'Checkpoint',
        position: { x: 3, y: 4 }
      },
      {
        id: 'to-forest',
        kind: 'exit',
        glyph: '>',
        targetArea: 'whispering-forest',
        label: 'Whispering Forest',
        position: { x: 12, y: 4 }
      },
      {
        id: 'to-mine',
        kind: 'exit',
        glyph: '>',
        targetArea: 'rust-mine',
        label: 'Rust Mine',
        position: { x: 12, y: 7 }
      }
    ]
  },
  'whispering-forest': {
    id: 'whispering-forest',
    name: 'Whispering Forest',
    width: 16,
    height: 11,
    spawn: { x: 2, y: 5 },
    checkpoint: { x: 2, y: 5 },
    walls: [
      ...border(16, 11),
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 12, y: 5 },
      { x: 7, y: 8 }
    ],
    entities: [
      enemy('forest-slime-1', 7, 3, 'slime'),
      enemy('forest-wolf-1', 12, 3, 'wolf'),
      enemy('forest-slime-2', 8, 7, 'slime'),
      {
        id: 'forest-node-1',
        kind: 'node',
        glyph: '*',
        label: 'Wild Glyphroot',
        position: { x: 4, y: 8 }
      },
      {
        id: 'to-village-from-forest',
        kind: 'exit',
        glyph: '<',
        targetArea: 'fracture-village',
        label: 'Fracture Village',
        position: { x: 1, y: 5 }
      },
      {
        id: 'to-ruins-from-forest',
        kind: 'exit',
        glyph: '>',
        targetArea: 'silent-ruins',
        label: 'Silent Ruins',
        position: { x: 14, y: 9 }
      }
    ]
  },
  'rust-mine': {
    id: 'rust-mine',
    name: 'Rust Mine',
    width: 16,
    height: 11,
    spawn: { x: 2, y: 5 },
    checkpoint: { x: 2, y: 5 },
    walls: [
      ...border(16, 11),
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 9, y: 7 },
      { x: 10, y: 7 },
      { x: 11, y: 7 }
    ],
    entities: [
      enemy('mine-bandit-1', 7, 2, 'bandit'),
      enemy('mine-slime-1', 13, 5, 'slime'),
      {
        id: 'mine-node-1',
        kind: 'node',
        glyph: '*',
        label: 'Iron Vein',
        position: { x: 6, y: 8 }
      },
      {
        id: 'mine-checkpoint',
        kind: 'checkpoint',
        glyph: '+',
        label: 'Checkpoint',
        position: { x: 2, y: 5 }
      },
      {
        id: 'to-village-from-mine',
        kind: 'exit',
        glyph: '<',
        targetArea: 'fracture-village',
        label: 'Fracture Village',
        position: { x: 1, y: 5 }
      }
    ]
  },
  'silent-ruins': {
    id: 'silent-ruins',
    name: 'Silent Ruins',
    width: 18,
    height: 12,
    spawn: { x: 2, y: 6 },
    checkpoint: { x: 2, y: 6 },
    walls: [
      ...border(18, 12),
      { x: 5, y: 2 },
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 12, y: 6 },
      { x: 12, y: 7 },
      { x: 12, y: 8 },
      { x: 8, y: 9 }
    ],
    entities: [
      enemy('ruins-wolf-1', 8, 3, 'wolf'),
      enemy('ruins-bandit-1', 13, 4, 'bandit'),
      enemy('ruins-watcher', 15, 9, 'watcher'),
      {
        id: 'to-forest-from-ruins',
        kind: 'exit',
        glyph: '<',
        targetArea: 'whispering-forest',
        label: 'Whispering Forest',
        position: { x: 1, y: 6 }
      }
    ]
  }
};
