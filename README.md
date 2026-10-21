# Martian Robots

A small TypeScript CLI implementing the Barclays Martian Robots assessment.
Robots run sequentially on an inclusive rectangular grid, sharing scents left
by robots that fall off an edge.

## Requirements and installation

Node.js 22 or later and npm:

```sh
npm ci
```

## Running

From a file:

```sh
npm start -- examples/sample.txt
```

From stdin:

```sh
npm start < examples/sample.txt
```

Use `npm run --silent start` instead of `npm start` when you need stdout to
contain only robot results (npm otherwise prints its own script banner).
Application errors go to stderr and exit with status 1, without partial results.
An input containing only world dimensions produces no application output.

Build and run the compiled CLI without npm's banner:

```sh
npm run build
node dist/index.js examples/sample.txt
```

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Tests cover parsing, commands, boundaries, shared scents, simulation isolation,
formatting, and CLI file/stdin/error paths. Type-checking includes the tests.

## Example

Input (`examples/sample.txt`):

```text
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

Output:

```text
1 1 E
3 3 N LOST
2 3 S
```

## Design and assumptions

- `parser.ts` validates the entire input before any simulation runs. Coordinates
  are decimal integers between 0 and 50; world and starting coordinates include
  their boundaries. Instruction strings contain 0–99 commands, since the brief
  requires fewer than 100 characters.
- Each robot uses exactly two lines: position, then instructions. An explicitly
  empty instruction line is valid; a missing line is an error. For example,
  `5 3\n1 1 N\n` has an empty instruction line, while `5 3\n1 1 N`
  is missing it. A conventional final newline after commands is accepted
  (`5 3\n1 1 N\nF\n`), as is a world with no robots (`5 3\n`).
  LF and CRLF are supported. Position tokens allow surrounding and
  separating whitespace; instruction lines contain only L/R/F, without spaces.
  Blank separator lines between robots are not part of the format.
- `commands.ts` contains static function handlers and a registry-based command
  guard. Commands return immutable robot states; `types.ts` holds shared types.
- `world.ts` encapsulates bounds and a coordinate-keyed scent set. **Scents are
  coordinate-only, regardless of orientation**: a scent at a corner protects a
  later robot from falling off either adjoining edge. This resolves the brief's
  ambiguity. Scents never block moves that stay within bounds.
- `simulation.ts` creates one world per run, processes robots in order, and stops
  a robot immediately on loss. `formatter.ts` produces output without a trailing
  newline; `index.ts` handles file/stdin I/O and adds a terminal newline only for
  nonempty output.

There are no runtime dependencies, services, command classes, or execution
history. Robot state lives in `types.ts`; a separate `robot.ts` would add no
behaviour or useful boundary here.
