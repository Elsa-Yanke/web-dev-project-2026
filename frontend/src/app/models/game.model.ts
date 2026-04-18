export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  release_year: number;
  price: string; 
  genre: Genre;  
  ai_summary: string; 
  image?: string;
}

export enum GameStatus {
  Playing = 'playing',
  Finished = 'finished',
  Planned = 'planned',
  Dropped = 'dropped'
}


export interface Review {
  id: number;
  game: number;
  user: string;      
  text: string;
  is_positive: boolean; 
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar: string;
}

export interface LibraryGame { 
  id: number;
  title: string;
  genre: Genre; 
  release_year: number;
  price: number;
  status: string;
  date_added: string;
}