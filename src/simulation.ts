import { commands } from './commands.js';
import type { Robot, SimulationInput } from './types.js';
import { World } from './world.js';

export function simulate(input: SimulationInput): Robot[] {
  const world = new World(input.maxX, input.maxY);
  return input.robots.map(({ position, instructions }) => {
    let robot = position;
    for (const instruction of instructions) {
      if (robot.lost) break;
      robot = commands[instruction](robot, world);
    }
    return robot;
  });
}
