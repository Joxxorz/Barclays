import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';

const cli = (args: string[] = [], input = '') => spawnSync(process.execPath,
  ['--import', 'tsx', 'src/index.ts', ...args], { input, encoding: 'utf8' });
const sample = '5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL\n';
const expected = '1 1 E\n3 3 N LOST\n2 3 S\n';
it('runs the sample through stdin', () => {
  const result = cli([], sample);
  expect(result.status).toBe(0);
  expect(result.stdout).toBe(expected);
  expect(result.stderr).toBe('');
});
it('runs the sample through a file argument', () => {
  const dir = mkdtempSync(join(tmpdir(), 'martian-'));
  try {
    const file = join(dir, 'input.txt');
    writeFileSync(file, sample);
    const result = cli([file], 'invalid stdin');
    expect(result.status).toBe(0);
    expect(result.stdout).toBe(expected);
    expect(result.stderr).toBe('');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
it('prints nothing for zero robots', () => {
  const result = cli([], '0 0\n');
  expect(result.status).toBe(0);
  expect(result.stdout).toBe('');
  expect(result.stderr).toBe('');
});
it.each([
  [[], '5 3\n0 0 N\nF\n1 1 N\nX', /Robot 2, line 5/],
  [['/nonexistent/martian-input.txt'], '', /ENOENT/],
  [['one', 'two'], '', /Usage/],
] as const)('reports errors without partial stdout', (args, input, message) => {
  const result = cli([...args], input);
  expect(result.status).toBe(1);
  expect(result.stdout).toBe('');
  expect(result.stderr).toMatch(message);
});
