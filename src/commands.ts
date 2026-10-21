import type { Command, Direction, Robot } from './types.js';
import type { World } from './world.js';

const directions: readonly Direction[] = ['N', 'E', 'S', 'W'];
const deltas: Record<Direction, readonly [number, number]> = {
  N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0],
};

function rotate(robot: Robot, steps: number): Robot {
  const direction = directions[(directions.indexOf(robot.direction) + steps + 4) % 4]!;
  return { ...robot, direction };
}

export const commands = {
  L: (robot: Robot, _world: World): Robot => rotate(robot, -1),
  R: (robot: Robot, _world: World): Robot => rotate(robot, 1),
  F: (robot: Robot, world: World): Robot => {
    const [dx, dy] = deltas[robot.direction];
    const x = robot.x + dx;
    const y = robot.y + dy;
    if (world.isWithinBounds(x, y)) return { ...robot, x, y };
    if (world.hasScent(robot.x, robot.y)) return { ...robot };
    world.addScent(robot.x, robot.y);
    return { ...robot, lost: true };
  },
} as const satisfies Record<Command, (robot: Robot, world: World) => Robot>;

export function isCommand(value: string): value is keyof typeof commands {
  return Object.hasOwn(commands, value);
}
