import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext'; // Importa contexto para reagir ao login
import type { Content, UserLists } from '@/types';
import {
  getUserLists as getLocalLists,
  addToWatchlist as addToLocalWatchlist,
  removeFromWatchlist as removeFromLocalWatchlist,
  markAsWatched as markAsLocalWatched,
  removeFromWatched as removeFromLocalWatched,
  moveToWatched as moveToLocalWatched,
} from '@/services/storageService';
import {
  getUserLists as getApiLists,
  addToList as addToApiList,
  removeFromList as removeFromApiList,
} from '@/services/api';

interface UseUserListsReturn {
  lists: UserLists;
  isLoading: boolean;
  addToWatchlist: (content: Content) => Promise<boolean>;
  removeFromWatchlist: (contentId: number) => Promise<void>;
  isInWatchlist: (contentId: number) => boolean;
  markAsWatched: (content: Content) => Promise<boolean>;
  removeFromWatched: (contentId: number) => Promise<void>;
  isWatched: (contentId: number) => boolean;
  moveToWatched: (contentId: number) => Promise<void>;
  refreshLists: () => Promise<void>;
}

/**
 * Hook personalizado para gerenciar as listas do usuário
 * Agora com suporte a sincronização com Backend se houver token
 */
export function useUserLists(): UseUserListsReturn {
  const { isAuthenticated } = useApp(); // Dependência do login
  const [lists, setLists] = useState<UserLists>({ watchlist: [], watched: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar listas (Local ou API)
  const refreshLists = useCallback(async () => {
    if (isAuthenticated) {
      try {
        // Tenta buscar do backend
        const apiLists = await getApiLists();
        setLists(apiLists);
      } catch (error) {
        console.error('Erro ao buscar listas do backend, usando local:', error);
        // Fallback para local em caso de erro (opcional, mas seguro)
        setLists(getLocalLists());
      }
    } else {
      // Usuário deslogado: usa local
      setLists(getLocalLists());
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  // Recarregar quando montar ou login mudar
  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  // Wrapper para adicionar à watchlist
  const handleAddToWatchlist = useCallback(async (content: Content): Promise<boolean> => {
    let success = false;
    
    if (isAuthenticated) {
      try {
        await addToApiList(content, 'watchlist');
        success = true;
      } catch (e) {
        console.error('Erro ao salvar na API:', e);
        success = false;
      }
    } else {
      success = addToLocalWatchlist(content);
    }

    await refreshLists(); // Sincroniza estado final
    return success;
  }, [refreshLists, isAuthenticated]);

  // Wrapper para remover da watchlist
  const handleRemoveFromWatchlist = useCallback(async (contentId: number): Promise<void> => {
    if (isAuthenticated) {
      try {
        await removeFromApiList(contentId, 'watchlist');
      } catch (e) {
        console.error(e);
      }
    } else {
      removeFromLocalWatchlist(contentId);
    }
    await refreshLists();
  }, [refreshLists, isAuthenticated]);

  // Wrapper para verificar se está na watchlist
  const handleIsInWatchlist = useCallback((contentId: number): boolean => {
    // Verifica no estado atual (que já veio da fonte certa)
    return lists.watchlist.some(item => item.content.id === contentId);
  }, [lists]);

  // Wrapper para marcar como assistido
  const handleMarkAsWatched = useCallback(async (content: Content): Promise<boolean> => {
    let success = false;

    if (isAuthenticated) {
      try {
        await addToApiList(content, 'watched');
        success = true;
      } catch (e) {
        console.error(e);
      }
    } else {
      success = markAsLocalWatched(content);
    }
    await refreshLists();
    return success;
  }, [refreshLists, isAuthenticated]);

  // Wrapper para remover de assistidos
  const handleRemoveFromWatched = useCallback(async (contentId: number): Promise<void> => {
    if (isAuthenticated) {
      try {
        await removeFromApiList(contentId, 'watched');
      } catch (e) {
        console.error(e);
      }
    } else {
      removeFromLocalWatched(contentId);
    }
    await refreshLists();
  }, [refreshLists, isAuthenticated]);

  // Wrapper para verificar se foi assistido
  const handleIsWatched = useCallback((contentId: number): boolean => {
    return lists.watched.some(item => item.content.id === contentId);
  }, [lists]);

  // Wrapper para mover para assistidos
  const handleMoveToWatched = useCallback(async (contentId: number): Promise<void> => {
    // Encontrar o conteúdo na lista atual
    const item = lists.watchlist.find(i => i.content.id === contentId);
    if (!item) return;

    if (isAuthenticated) {
      try {
        // Remove da watchlist e adiciona em watched
        // O backend idealmente teria um endpoint 'move', mas faremos em 2 passos ou o endpoint 'add' ja trata
        // Nosso backend 'addToList' com type='watched' já remove da watchlist!
        await addToApiList(item.content, 'watched');
      } catch (e) {
        console.error(e);
      }
    } else {
      moveToLocalWatched(contentId);
    }
    await refreshLists();
  }, [lists, refreshLists, isAuthenticated]);

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
