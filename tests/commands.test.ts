import { expect, it } from 'vitest';
import { commands, isCommand } from '../src/commands.js';
import { World } from '../src/world.js';
import type { Direction } from '../src/types.js';

it.each<[Direction, Direction, Direction, number, number]>([
  ['N', 'W', 'E', 1, 2], ['E', 'N', 'S', 2, 1],
  ['S', 'E', 'W', 1, 0], ['W', 'S', 'N', 0, 1],
])('turns and moves from %s without mutating input', (direction, left, right, x, y) => {
  const robot = { x: 1, y: 1, direction, lost: false };
  const world = new World(3, 3);
  expect(commands.L(robot, world)).toEqual({ ...robot, direction: left });
  expect(commands.R(robot, world)).toEqual({ ...robot, direction: right });
  expect(commands.F(robot, world)).toEqual({ ...robot, x, y });
  expect(robot).toEqual({ x: 1, y: 1, direction, lost: false });
});
it.each(['L', 'R', 'F'])('recognises command %s', command => expect(isCommand(command)).toBe(true));
it.each(['', 'toString', 'l', 'FF', 'X'])('rejects noncommand %j', command => expect(isCommand(command)).toBe(false));
