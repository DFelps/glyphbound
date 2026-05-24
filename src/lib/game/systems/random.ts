export function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function roll(chance: number): boolean {
  return Math.random() < chance;
}
