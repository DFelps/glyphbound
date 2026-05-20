import type { Area, Entity, GameState, Point } from '../types/game';
import { areas } from '../data/areas';
import { cloneEnemy } from '../data/enemies';
import { between, roll } from './random';

export function currentArea(state: GameState): Area {
  return areas[state.areaId];
}

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isAdjacent(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

export function isWall(area: Area, point: Point): boolean {
  return area.walls.some((wall) => samePoint(wall, point));
}

export function entityAt(area: Area, point: Point): Entity | undefined {
  return area.entities.find((entity) => samePoint(entity.position, point));
}

export function removeEntity(area: Area, id: string): void {
  area.entities = area.entities.filter((entity) => entity.id !== id);
}

export function maybeSpawnNullEraser(area: Area, state: GameState): string | null {
  const danger = state.event?.dangerMultiplier ?? 1;

  if (!roll(0.04 * danger)) {
    return null;
  }

  const position = {
    x: between(2, area.width - 3),
    y: between(2, area.height - 3)
  };

  if (isWall(area, position) || entityAt(area, position) || samePoint(position, state.player.position)) {
    return null;
  }

  const mob = cloneEnemy('nullEraser');
  area.entities.push({
    id: `null-eraser-${Date.now()}`,
    kind: 'enemy',
    glyph: mob.glyph,
    position,
    enemy: mob
  });

  return 'A Null Eraser entered the area.';
}

export function tickWorldEvent(state: GameState): void {
  if (!state.event) {
    return;
  }

  state.event.remaining -= 1;

  if (state.event.remaining <= 0) {
    state.log.unshift(`${state.event.name} faded.`);
    state.event = null;
  }
}

export function maybeStartWorldEvent(state: GameState): void {
  if (state.event || !roll(0.08)) {
    return;
  }

  const events = [
    {
      id: 'golden-fever',
      name: 'Golden Fever',
      description: 'Gold drops are doubled for a short time.',
      remaining: 8,
      goldMultiplier: 2,
      dangerMultiplier: 1
    },
    {
      id: 'null-hunt',
      name: 'Null Hunt',
      description: 'The Null is watching. Erasers may appear.',
      remaining: 7,
      goldMultiplier: 1.4,
      dangerMultiplier: 3
    },
    {
      id: 'merchant-static',
      name: 'Merchant Static',
      description: 'The Dealer feels generous. Gacha is cheaper.',
      remaining: 6,
      goldMultiplier: 1,
      dangerMultiplier: 1
    }
  ];

  state.event = events[Math.floor(Math.random() * events.length)];
  state.log.unshift(`${state.event.name}: ${state.event.description}`);
}
