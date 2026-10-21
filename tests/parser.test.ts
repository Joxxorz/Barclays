import { describe, expect, it } from 'vitest';
import { parseInput } from '../src/parser.js';

describe('parseInput', () => {
  it.each(['\n', '\r\n'])('accepts line endings %j and a final newline', nl => {
    const input = parseInput(['50 50', ' 50\t50 E ', 'F', ''].join(nl));
    expect(input).toMatchObject({ maxX: 50, maxY: 50, robots: [{ position: { x: 50, y: 50, direction: 'E' }, instructions: ['F'] }] });
  });
  it.each(['0 0', '0 0\n'])('accepts zero robots: %j', raw => {
    expect(parseInput(raw).robots).toEqual([]);
  });
  it('preserves an explicitly empty instruction line, including before another robot', () => {
    expect(parseInput('5 3\n1 1 N\n\n2 2 E\nF').robots.map(r => r.instructions)).toEqual([[], ['F']]);
    expect(parseInput('5 3\n1 1 N\n\n').robots[0]?.instructions).toEqual([]);
  });
  it.each(['\n', '\r\n'])('handles EOF instruction slots with %j line endings', nl => {
    expect(parseInput(['5 3', '1 1 N', ''].join(nl)).robots[0]?.instructions).toEqual([]);
    expect(() => parseInput(['5 3', '1 1 N'].join(nl))).toThrow(/missing instruction line/);
    expect(parseInput(['5 3', '1 1 N', 'F', ''].join(nl)).robots[0]?.instructions).toEqual(['F']);
    expect(parseInput(['5 3', ''].join(nl)).robots).toEqual([]);
    expect(() => parseInput(['5 3', '', ''].join(nl))).toThrow(/expected position/);
    expect(() => parseInput(['5 3', '1 1 N', 'F', '', ''].join(nl))).toThrow(/expected position/);
  });
  it('accepts 99 instructions', () => {
    expect(parseInput(`50 50\n0 0 N\n${'R'.repeat(99)}`).robots[0]?.instructions).toHaveLength(99);
  });
  it.each([
    '', '5', '5 3 2', '-1 3', '51 3', '5 1.5', 'NaN 3', '1e1 3',
    '5 3\n-1 0 N\nF', '5 3\n1.5 0 N\nF', '5 3\n51 0 N\nF',
    '5 3\n6 0 N\nF', '5 3\n0 4 N\nF', '5 3\n0 0 Q\nF',
    '5 3\n0 0 NN\nF', '5 3\n0 0 N\nf', '5 3\n0 0 N\nF F',
    '5 3\n0 0 N', '5 3\n\nF', '5 3\n0 0\nF',
    `5 3\n0 0 N\n${'F'.repeat(100)}`, '5 3\n\n',
  ])('rejects malformed input %j', raw => {
    expect(() => parseInput(raw)).toThrow(Error);
  });
  it('reports robot and line context', () => {
    expect(() => parseInput('5 3\n0 0 N\nX')).toThrow(/Robot 1, line 3: invalid command/);
  });
});
