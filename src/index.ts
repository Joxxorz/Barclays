import { readFileSync } from 'node:fs';
import { parseInput } from './parser.js';
import { simulate } from './simulation.js';
import { formatOutput } from './formatter.js';

try {
  if (process.argv.length > 3) throw new Error('Usage: npm start -- [input.txt]');
  const raw = readFileSync(process.argv[2] ?? 0, 'utf8');
  const output = formatOutput(simulate(parseInput(raw)));
  if (output !== '') process.stdout.write(`${output}\n`);
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
