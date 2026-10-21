import { expect, it } from 'vitest';
import { formatOutput } from '../src/formatter.js';

it('formats ordered robot states, LOST suffixes, and no trailing newline', () => {
  const robots = [
    { x: 1, y: 1, direction: 'E' as const, lost: false },
    { x: 3, y: 3, direction: 'N' as const, lost: true },
    { x: 2, y: 3, direction: 'S' as const, lost: false },
  ];
  const before = structuredClone(robots);
  expect(formatOutput(robots)).toBe('1 1 E\n3 3 N LOST\n2 3 S');
  expect(robots).toEqual(before);
  expect(formatOutput([])).toBe('');
});
