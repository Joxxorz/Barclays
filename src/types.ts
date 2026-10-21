export type Command = 'L' | 'R' | 'F';
export type Direction = 'N' | 'E' | 'S' | 'W';
export type Robot = Readonly<{
  x: number;
  y: number;
  direction: Direction;
  lost: boolean;
}>;
export type RobotInput = Readonly<{
  position: Robot;
  instructions: readonly Command[];
}>;
export type SimulationInput = Readonly<{
  maxX: number;
  maxY: number;
  robots: readonly RobotInput[];
}>;
