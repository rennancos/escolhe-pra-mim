import type { Content, ContentType, FilterOptions } from '@/types';
import mockCatalog from '@/data/mockCatalog.json';

// Configuração da API TMDB
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Flag para usar mock ou API real
const USE_MOCK = false; // Altere para false quando quiser usar a API real

/**
 * Serviço para integração com TMDB API
 * 
 * Este serviço está preparado para trabalhar com dados mockados (MVP)
 * e pode ser facilmente migrado para a API real da TMDB.
 * 
 * Para migrar:
 * 1. Defina USE_MOCK = false
 * 2. Certifique-se de que a API key está válida
 * 3. Ajuste os mapeamentos de dados conforme necessário
 */

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

// Mapeamento de gêneros da TMDB para nossos gêneros
const genreMapping: Record<number, string> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Suspense',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Suspense',
  10752: 'Guerra',
  37: 'Faroeste',
};

// Mapeamento de provedores de streaming
const providerMapping: Record<number, string> = {
  8: 'Netflix',
  307: 'Globoplay',
  384: 'HBO Max',
  337: 'Disney+',
  119: 'Prime Video',
  350: 'Apple TV+',
  618: 'Mercado Play',
};

// Mapeamento reverso para filtros
const genreIDMapping: Record<string, number> = Object.entries(genreMapping).reduce((acc, [id, name]) => {
  acc[name] = Number(id);
  return acc;
}, {} as Record<string, number>);

const providerIDMapping: Record<string, number> = Object.entries(providerMapping).reduce((acc, [id, name]) => {
  acc[name] = Number(id);
  return acc;
}, {} as Record<string, number>);

/**
 * Busca conteúdo da API TMDB ou do mock
 */
export async function discoverContent(
  type: ContentType | 'all',
  page: number = 1,
  filters?: FilterOptions
): Promise<Content[]> {
  if (USE_MOCK) {
    return getMockContent(type === 'all' ? 'movie' : type);
  }

  try {
    const endpoints = type === 'all' ? ['discover/movie', 'discover/tv'] : [type === 'movie' ? 'discover/movie' : 'discover/tv'];
    
    // Preparar filtros
    const genreIds = filters?.genres?.map(g => genreIDMapping[g]).filter(Boolean).join('|') || '';
    const providerIds = filters?.streaming?.map(s => providerIDMapping[s]).filter(Boolean).join('|') || '';
    
    const fetchPromises = endpoints.map(async (endpoint) => {
      const currentType: ContentType = endpoint.includes('movie') ? 'movie' : 'series';
      
      const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
        page: page.toString(),
        sort_by: 'popularity.desc',
        watch_region: 'BR',
        'vote_count.gte': '100'
      });

      if (genreIds) params.append('with_genres', genreIds);
      if (providerIds) params.append('with_watch_providers', providerIds);

      const response = await fetch(`${TMDB_BASE_URL}/${endpoint}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from TMDB: ${endpoint}`);
      }

      const data = await response.json();
      return mapTMDBToContent(data.results, currentType);
    });

    const results = await Promise.all(fetchPromises);
    return results.flat().sort(() => 0.5 - Math.random()); // Embaralhar resultados misturados

  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    // Fallback para mock em caso de erro
    return getMockContent(type === 'all' ? 'movie' : type);
  }
}

/**
 * Busca gêneros disponíveis na TMDB
 */
export async function getGenres(type: ContentType): Promise<TMDBGenre[]> {
  if (USE_MOCK) {
    return [];
  }

  try {
    const endpoint = type === 'movie' ? 'genre/movie/list' : 'genre/tv/list';
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

/**
 * Busca provedores de streaming disponíveis para um conteúdo
 */
export async function getWatchProviders(
  contentId: number,
  type: ContentType
): Promise<string[]> {
  if (USE_MOCK) {
    return [];
  }

  try {
    const endpoint = type === 'movie' ? `movie/${contentId}` : `tv/${contentId}`;
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}/watch/providers?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch watch providers');
    }

    const data = await response.json();
    const brProviders = data.results?.BR?.flatrate || [];
    
    return brProviders
      .map((p: TMDBWatchProvider) => providerMapping[p.provider_id])
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return [];
  }
}

/**
 * Busca conteúdo por texto
 */
export async function searchContent(
  query: string,
  type: ContentType
): Promise<Content[]> {
  if (USE_MOCK) {
    return searchMockContent(query, type);
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to search content');
    }

    const data = await response.json();
    return mapTMDBToContent(data.results, type);
  } catch (error) {
    console.error('Error searching content:', error);
    return searchMockContent(query, type);
  }
}

/**
 * Retorna a URL completa da imagem
 */
export function getImageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Funções auxiliares para mock

function getMockContent(type: ContentType): Content[] {
  const catalog = mockCatalog as { movies: Content[]; series: Content[] };
  return type === 'movie' ? catalog.movies : catalog.series;
}

function searchMockContent(query: string, type: ContentType): Content[] {
  const catalog = mockCatalog as { movies: Content[]; series: Content[] };
  const content = type === 'movie' ? catalog.movies : catalog.series;
  
  const lowerQuery = query.toLowerCase();
  return content.filter(item =>
    item.title.toLowerCase().includes(lowerQuery)
  );
}

function mapTMDBToContent(
  items: (TMDBMovie | TMDBTVShow)[],
  type: ContentType
): Content[] {
  return items.map(item => {
    const isMovie = 'title' in item;
    
    return {
      id: item.id,
      title: isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name,
      type,
      genres: item.genre_ids.map(id => genreMapping[id] || 'Outros').filter(Boolean),
      streaming: [], // Seria preenchido com getWatchProviders
      overview: item.overview,
      posterPath: getImageUrl(item.poster_path) || undefined,
      rating: item.vote_average,
      year: parseInt(isMovie 
        ? (item as TMDBMovie).release_date 
        : (item as TMDBTVShow).first_air_date
      ) || undefined,
    };
  });
}

/**
 * Filtra conteúdo baseado nas opções selecionadas
 */
export function filterContent(
  content: Content[],
  filters: FilterOptions,
  excludeIds: number[] = []
): Content[] {
  return content.filter(item => {
    // Excluir IDs já vistos
    if (excludeIds.includes(item.id)) {
      return false;
    }

    // Filtrar por tipo
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }

    // Filtrar por gêneros (se selecionados)
    if (filters.genres.length > 0) {
      const hasGenre = filters.genres.some(genre => 
        item.genres.includes(genre)
      );
      if (!hasGenre) return false;
    }

    // Filtrar por streaming (se selecionados)
    if (filters.streaming.length > 0) {
      const hasStreaming = filters.streaming.some(service =>
        item.streaming.includes(service)
      );
      if (!hasStreaming) return false;
    }

    return true;
  });
}

/**
 * Retorna conteúdo aleatório baseado nos filtros
 */
export function getRandomContent(
  content: Content[],
  count: number = 10
): Content[] {
  if (content.length === 0) return [];
  
  // Embaralhar array usando Fisher-Yates
  const shuffled = [...content];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default {
  discoverContent,
  getGenres,
  getWatchProviders,
  searchContent,
  getImageUrl,
  filterContent,
  getRandomContent,
};
