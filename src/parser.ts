import { isCommand } from './commands.js';
import type { Direction, RobotInput, SimulationInput } from './types.js';

function coordinate(token: string, context: string): number {
  if (!/^\d+$/.test(token)) throw new Error(`${context}: expected an integer coordinate`);
  const value = Number(token);
  if (!Number.isSafeInteger(value) || value > 50) {
    throw new Error(`${context}: coordinates must be between 0 and 50`);
  }
  return value;
}

export function parseInput(raw: string): SimulationInput {
  const lines = raw.split(/\r?\n/);
  // A trailing empty position slot is a final newline; an instruction slot is meaningful.
  if (raw.endsWith('\n') && lines.length % 2 === 0) lines.pop();
  const worldTokens = (lines[0] ?? '').trim().split(/\s+/);
  if (worldTokens.length !== 2) throw new Error('Line 1: expected world dimensions (maxX maxY)');
  const maxX = coordinate(worldTokens[0]!, 'Line 1');
  const maxY = coordinate(worldTokens[1]!, 'Line 1');
  const robots: RobotInput[] = [];

  for (let i = 1; i < lines.length; i += 2) {
    const context = `Robot ${robots.length + 1}, line ${i + 1}`;
    const tokens = lines[i]!.trim().split(/\s+/);
    if (tokens.length !== 3) throw new Error(`${context}: expected position (x y direction)`);
    const x = coordinate(tokens[0]!, context);
    const y = coordinate(tokens[1]!, context);
    if (x > maxX || y > maxY) throw new Error(`${context}: starting position is outside the world`);
    const direction = tokens[2]!;
    if (!/^[NESW]$/.test(direction)) throw new Error(`${context}: invalid orientation '${direction}'`);
    const instructions = lines[i + 1];
    const instructionContext = `Robot ${robots.length + 1}, line ${i + 2}`;
    if (instructions === undefined) throw new Error(`${instructionContext}: missing instruction line`);
    if (instructions.length >= 100) throw new Error(`${instructionContext}: instructions must be fewer than 100 characters`);
    const validated = [...instructions].map(command => {
      if (!isCommand(command)) throw new Error(`${instructionContext}: invalid command '${command}'`);
      return command;
    });
    robots.push({ position: { x, y, direction: direction as Direction, lost: false }, instructions: validated });
  }
  return { maxX, maxY, robots };
}
