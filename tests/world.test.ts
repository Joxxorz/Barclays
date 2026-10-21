import { expect, it } from 'vitest';
import { World } from '../src/world.js';

it('includes all boundary coordinates and excludes points outside', () => {
  const world = new World(50, 50);
  for (const [x, y] of [[0, 0], [50, 0], [0, 50], [50, 50]]) expect(world.isWithinBounds(x!, y!)).toBe(true);
  for (const [x, y] of [[-1, 0], [0, -1], [51, 0], [0, 51]]) expect(world.isWithinBounds(x!, y!)).toBe(false);
});
it('stores scents by coordinate without collisions, independently per world', () => {
  const world = new World(50, 50);
  world.addScent(1, 23);
  world.addScent(1, 23);
  expect(world.hasScent(1, 23)).toBe(true);
  expect(world.hasScent(12, 3)).toBe(false);
  expect(new World(50, 50).hasScent(1, 23)).toBe(false);
});
