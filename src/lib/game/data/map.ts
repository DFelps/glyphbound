import type { Actor, Gate, Point } from '../types/game';

export const mapWidth = 70;
export const mapHeight = 28;

function blank(): string[][] {
  return Array.from({ length: mapHeight }, () => Array.from({ length: mapWidth }, () => ' '));
}

function put(grid: string[][], x: number, y: number, text: string): void {
  [...text].forEach((char, offset) => {
    if (grid[y] && grid[y][x + offset] !== undefined) {
      grid[y][x + offset] = char;
    }
  });
}

function lineH(grid: string[][], x1: number, x2: number, y: number, char = '.'): void {
  for (let x = x1; x <= x2; x += 1) grid[y][x] = char;
}

function lineV(grid: string[][], x: number, y1: number, y2: number, char = '.'): void {
  for (let y = y1; y <= y2; y += 1) grid[y][x] = char;
}

function box(grid: string[][], x: number, y: number, w: number, h: number): void {
  put(grid, x, y, '+' + '-'.repeat(w - 2) + '+');
  for (let row = y + 1; row < y + h - 1; row += 1) {
    put(grid, x, row, '|' + ' '.repeat(w - 2) + '|');
  }
  put(grid, x, y + h - 1, '+' + '-'.repeat(w - 2) + '+');
}

const grid = blank();

box(grid, 1, 18, 18, 8);
put(grid, 6, 19, 'VILLAGE');
put(grid, 4, 21, '[F] FORGE');
put(grid, 4, 22, '[M] MARKET');
put(grid, 4, 23, '[S] SHRINE');
put(grid, 7, 24, '[+] REST');

grid[18][10] = '.';
lineV(grid, 10, 15, 18);
lineH(grid, 10, 24, 15);
put(grid, 19, 13, 'AREA I');
put(grid, 17, 14, 'WILD ROAD');
put(grid, 16, 12, '^^^^^^');
put(grid, 21, 17, 'vvvvvv');

grid[15][25] = '=';
put(grid, 24, 13, 'BOSS I');
lineH(grid, 26, 39, 15);
put(grid, 32, 12, 'AREA II');
put(grid, 31, 13, 'INK HOLLOW');
put(grid, 34, 10, '____');
put(grid, 33, 11, '/____\\');

grid[15][40] = '=';
put(grid, 39, 13, 'BOSS II');
lineH(grid, 41, 55, 15);
put(grid, 47, 12, 'AREA III');
put(grid, 47, 13, 'ASH RUINS');
put(grid, 49, 10, '[ ][ ]');
put(grid, 48, 11, '/____\\');

grid[15][56] = '=';
lineH(grid, 57, 64, 15);
lineV(grid, 64, 8, 15);
put(grid, 58, 6, 'FINAL SPIRE');
put(grid, 62, 7, '/\\');
put(grid, 61, 8, '/__\\');

put(grid, 2, 2, 'GLYPHBOUND: ROGUE ROAD');
put(grid, 2, 3, 'one map / one path / assisted combat');
put(grid, 2, 5, 'clear mobs -> reveal boss -> break gate');
put(grid, 2, 7, 'click adjacent cells or use arrows');

export const baseMap = grid.map((row) => row.join(''));

export const spawn: Point = { x: 10, y: 23 };

export const gates: Gate[] = [
  { id: 'gate1', position: { x: 25, y: 15 }, label: 'Gate I', requiredKills: 'meadowKills', requiredAmount: 3 },
  { id: 'gate2', position: { x: 40, y: 15 }, label: 'Gate II', requiredBoss: 'boss1', requiredKills: 'hollowKills', requiredAmount: 3 },
  { id: 'gate3', position: { x: 56, y: 15 }, label: 'Gate III', requiredBoss: 'boss2', requiredKills: 'ruinsKills', requiredAmount: 3 }
];

export const actors: Actor[] = [
  { id: 'rat-1', enemyId: 'rat', position: { x: 16, y: 15 } },
  { id: 'rat-2', enemyId: 'rat', position: { x: 20, y: 15 } },
  { id: 'thorn-1', enemyId: 'thorn', position: { x: 23, y: 15 } },
  { id: 'boss-1', enemyId: 'warden', position: { x: 25, y: 14 }, required: 'boss1' },

  { id: 'scribe-1', enemyId: 'hollow', position: { x: 30, y: 15 } },
  { id: 'knight-1', enemyId: 'knight', position: { x: 34, y: 15 } },
  { id: 'scribe-2', enemyId: 'hollow', position: { x: 38, y: 15 } },
  { id: 'boss-2', enemyId: 'pageBoss', position: { x: 40, y: 14 }, required: 'boss2' },

  { id: 'ash-1', enemyId: 'ashling', position: { x: 45, y: 15 } },
  { id: 'guard-1', enemyId: 'nullGuard', position: { x: 49, y: 15 } },
  { id: 'ash-2', enemyId: 'ashling', position: { x: 53, y: 15 } },
  { id: 'boss-3', enemyId: 'finalBoss', position: { x: 64, y: 8 }, required: 'boss3' }
];

export function charAt(point: Point): string {
  return baseMap[point.y]?.[point.x] ?? ' ';
}
