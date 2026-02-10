export type ContentType = 'movie' | 'series';

export interface Content {
  id: number;
  title: string;
  type: ContentType;
  genres: string[];
  streaming: string[];
  overview?: string;
  posterPath?: string;
  rating?: number;
  year?: number;
}

export interface FilterOptions {
  type: ContentType | 'all';
  genres: string[];
  streaming: string[];
}

export interface UserContent {
  content: Content;
  addedAt: string;
}

export interface UserLists {
  watchlist: UserContent[];
  watched: UserContent[];
}

export type Genre = 
  | 'Ação'
  | 'Comédia'
  | 'Terror'
  | 'Drama'
  | 'Romance'
  | 'Documentário'
  | 'Ficção Científica'
  | 'Suspense'
  | 'Animação'
  | 'Aventura'
  | 'Fantasia'
  | 'Crime'
  | 'Outros';

export type StreamingService =
  | 'Netflix'
  | 'Globoplay'
  | 'HBO Max'
  | 'Disney+'
  | 'Prime Video'
  | 'Apple TV+'
  | 'Mercado Play';

export const GENRES: Genre[] = [
  'Ação',
  'Comédia',
  'Terror',
  'Drama',
  'Romance',
  'Documentário',
  'Ficção Científica',
  'Suspense',
  'Animação',
  'Aventura',
  'Fantasia',
  'Crime',
  'Outros',
];

export const STREAMING_SERVICES: StreamingService[] = [
  'Netflix',
  'Globoplay',
  'HBO Max',
  'Disney+',
  'Prime Video',
  'Apple TV+',
  'Mercado Play',
];
