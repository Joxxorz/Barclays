import { expect, it } from 'vitest';
import { parseInput } from '../src/parser.js';
import { simulate } from '../src/simulation.js';
import { formatOutput } from '../src/formatter.js';

const run = (raw: string) => formatOutput(simulate(parseInput(raw)));

it('reproduces the assessment sample in robot order', () => {
  expect(run('5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL'))
    .toBe('1 1 E\n3 3 N LOST\n2 3 S');
});
it.each([
  ['0 1 W', '0 1 W LOST'], ['2 1 E', '2 1 E LOST'],
  ['1 0 S', '1 0 S LOST'], ['1 2 N', '1 2 N LOST'],
])('falls from %s, retaining its last position and ignoring subsequent turns', (start, expected) => {
  expect(run(`2 2\n${start}\nFRRFF`)).toBe(expected);
});
it('shares coordinate-only scents across orientations and permits valid movement', () => {
  expect(run('1 1\n0 0 W\nF\n0 0 S\nFRRF'))
    .toBe('0 0 W LOST\n0 1 N');
});
it('ignores repeated fatal moves at a scent and continues executing', () => {
  expect(run('1 1\n1 1 N\nF\n1 1 N\nFFRFFRFF'))
    .toBe('1 1 N LOST\n1 0 S LOST');
});
it('isolates scents between runs and leaves input untouched', () => {
  const input = parseInput('0 0\n0 0 N\nF');
  const before = structuredClone(input);
  expect(simulate(input)[0]?.lost).toBe(true);
  expect(simulate(input)[0]?.lost).toBe(true);
  expect(input).toEqual(before);
});
it('handles empty instructions, empty robot lists and maximum coordinates', () => {
  expect(run('50 50\n50 50 E\n\n')).toBe('50 50 E');
  expect(simulate(parseInput('0 0'))).toEqual([]);
  expect(run('50 50\n49 50 E\nFF')).toBe('50 50 E LOST');
});
