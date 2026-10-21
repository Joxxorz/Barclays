export class World {
  private readonly scents = new Set<string>();

  constructor(readonly maxX: number, readonly maxY: number) {}

  isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
  }

  private scentKey(x: number, y: number): string {
    // A scent belongs to a coordinate, irrespective of departure orientation.
    return `${x},${y}`;
  }

  hasScent(x: number, y: number): boolean {
    return this.scents.has(this.scentKey(x, y));
  }

  addScent(x: number, y: number): void {
    this.scents.add(this.scentKey(x, y));
  }
}
