export type UpdateNodePositions = {
  id: string;
  type: 'trigger' | 'actionInstance';
  x: number;
  y: number;
}[];
