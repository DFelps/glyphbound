export function roll(chance: number): boolean {
  return Math.random() < chance;
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
