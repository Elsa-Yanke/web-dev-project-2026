export enum GameStatus {
  Playing = 'playing',
  Finished = 'finished',
  Planned = 'planned',
  Dropped = 'dropped',
}

export interface UserGame {
  id: number;
  user: number;
  game: number;
  status: GameStatus;
  added_at: string;
}
