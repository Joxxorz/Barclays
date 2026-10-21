import type { Robot } from './types.js';

export function formatOutput(robots: Robot[]): string {
  return robots.map(robot =>
    `${robot.x} ${robot.y} ${robot.direction}${robot.lost ? ' LOST' : ''}`,
  ).join('\n');
}
