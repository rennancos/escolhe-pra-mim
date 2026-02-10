import { useState, useEffect, useCallback } from 'react';
import type { Content, UserLists } from '@/types';
import {
  getUserLists,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  markAsWatched,
  removeFromWatched,
  isWatched,
  moveToWatched,
} from '@/services';

interface UseUserListsReturn {
  lists: UserLists;
  isLoading: boolean;
  addToWatchlist: (content: Content) => boolean;
  removeFromWatchlist: (contentId: number) => void;
  isInWatchlist: (contentId: number) => boolean;
  markAsWatched: (content: Content) => boolean;
  removeFromWatched: (contentId: number) => void;
  isWatched: (contentId: number) => boolean;
  moveToWatched: (contentId: number) => void;
  refreshLists: () => void;
}

/**
 * Hook personalizado para gerenciar as listas do usuário
 * 
 * Gerencia:
 * - Watchlist (Para assistir depois)
 * - Watched (Já assistidos)
 * - Sincronização com localStorage
 */
export function useUserLists(): UseUserListsReturn {
  const [lists, setLists] = useState<UserLists>({ watchlist: [], watched: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar listas do localStorage
  const refreshLists = useCallback(() => {
    const userLists = getUserLists();
    setLists(userLists);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  // Wrapper para adicionar à watchlist
  const handleAddToWatchlist = useCallback((content: Content): boolean => {
    const result = addToWatchlist(content);
    refreshLists();
    return result;
  }, [refreshLists]);

  // Wrapper para remover da watchlist
  const handleRemoveFromWatchlist = useCallback((contentId: number): void => {
    removeFromWatchlist(contentId);
    refreshLists();
  }, [refreshLists]);

  // Wrapper para verificar se está na watchlist
  const handleIsInWatchlist = useCallback((contentId: number): boolean => {
    return isInWatchlist(contentId);
  }, []);

  // Wrapper para marcar como assistido
  const handleMarkAsWatched = useCallback((content: Content): boolean => {
    const result = markAsWatched(content);
    refreshLists();
    return result;
  }, [refreshLists]);

  // Wrapper para remover de assistidos
  const handleRemoveFromWatched = useCallback((contentId: number): void => {
    removeFromWatched(contentId);
    refreshLists();
  }, [refreshLists]);

  // Wrapper para verificar se foi assistido
  const handleIsWatched = useCallback((contentId: number): boolean => {
    return isWatched(contentId);
  }, []);

  // Wrapper para mover para assistidos
  const handleMoveToWatched = useCallback((contentId: number): void => {
    moveToWatched(contentId);
    refreshLists();
  }, [refreshLists]);

  return {
    lists,
    isLoading,
    addToWatchlist: handleAddToWatchlist,
    removeFromWatchlist: handleRemoveFromWatchlist,
    isInWatchlist: handleIsInWatchlist,
    markAsWatched: handleMarkAsWatched,
    removeFromWatched: handleRemoveFromWatched,
    isWatched: handleIsWatched,
    moveToWatched: handleMoveToWatched,
    refreshLists,
  };
}

export default useUserLists;
