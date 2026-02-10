import type { UserLists, UserContent, Content } from '@/types';

/**
 * Serviço para persistência de dados no localStorage
 * 
 * Gerencia as listas do usuário:
 * - Watchlist (Para assistir depois)
 * - Watched (Já assistidos)
 * 
 * Futuramente pode ser facilmente migrado para backend
 * substituindo as chamadas localStorage por chamadas API
 */

const STORAGE_KEY = 'escolhe-pra-mim-data';
const SETTINGS_KEY = 'escolhe-pra-mim-settings';

export interface UserSettings {
  includeWatchedInDraw: boolean;
  darkMode: boolean;
}

const defaultSettings: UserSettings = {
  includeWatchedInDraw: false,
  darkMode: false,
};

/**
 * Obtém os dados do usuário do localStorage
 */
export function getUserLists(): UserLists {
  if (typeof window === 'undefined') {
    return { watchlist: [], watched: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }

  return { watchlist: [], watched: [] };
}

/**
 * Salva os dados do usuário no localStorage
 */
export function saveUserLists(lists: UserLists): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Adiciona um conteúdo à watchlist
 */
export function addToWatchlist(content: Content): boolean {
  const lists = getUserLists();
  
  // Verificar se já existe
  if (lists.watchlist.some(item => item.content.id === content.id)) {
    return false;
  }

  const userContent: UserContent = {
    content,
    addedAt: new Date().toISOString(),
  };

  lists.watchlist.push(userContent);
  saveUserLists(lists);
  return true;
}

/**
 * Remove um conteúdo da watchlist
 */
export function removeFromWatchlist(contentId: number): void {
  const lists = getUserLists();
  lists.watchlist = lists.watchlist.filter(
    item => item.content.id !== contentId
  );
  saveUserLists(lists);
}

/**
 * Verifica se um conteúdo está na watchlist
 */
export function isInWatchlist(contentId: number): boolean {
  const lists = getUserLists();
  return lists.watchlist.some(item => item.content.id === contentId);
}

/**
 * Marca um conteúdo como assistido
 */
export function markAsWatched(content: Content): boolean {
  const lists = getUserLists();
  
  // Verificar se já existe
  if (lists.watched.some(item => item.content.id === content.id)) {
    return false;
  }

  // Remover da watchlist se estiver lá
  lists.watchlist = lists.watchlist.filter(
    item => item.content.id !== content.id
  );

  const userContent: UserContent = {
    content,
    addedAt: new Date().toISOString(),
  };

  lists.watched.push(userContent);
  saveUserLists(lists);
  return true;
}

/**
 * Remove um conteúdo da lista de assistidos
 */
export function removeFromWatched(contentId: number): void {
  const lists = getUserLists();
  lists.watched = lists.watched.filter(
    item => item.content.id !== contentId
  );
  saveUserLists(lists);
}

/**
 * Verifica se um conteúdo foi assistido
 */
export function isWatched(contentId: number): boolean {
  const lists = getUserLists();
  return lists.watched.some(item => item.content.id === contentId);
}

/**
 * Move um conteúdo da watchlist para assistidos
 */
export function moveToWatched(contentId: number): void {
  const lists = getUserLists();
  const item = lists.watchlist.find(item => item.content.id === contentId);
  
  if (item) {
    removeFromWatchlist(contentId);
    markAsWatched(item.content);
  }
}

/**
 * Obtém as configurações do usuário
 */
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }

  return defaultSettings;
}

/**
 * Salva as configurações do usuário
 */
export function saveSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;

  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

/**
 * Obtém os IDs dos conteúdos assistidos
 */
export function getWatchedIds(): number[] {
  const lists = getUserLists();
  return lists.watched.map(item => item.content.id);
}

/**
 * Limpa todos os dados do usuário
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

export default {
  getUserLists,
  saveUserLists,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  markAsWatched,
  removeFromWatched,
  isWatched,
  moveToWatched,
  getSettings,
  saveSettings,
  getWatchedIds,
  clearAllData,
};
