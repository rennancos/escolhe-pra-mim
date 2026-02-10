import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getSettings, saveSettings, getWatchedIds } from '@/services';
import { discoverContent, getWatchProviders } from '@/services/tmdbService';
import type { Content, FilterOptions } from '@/types';
import { getContents } from '@/services/api';

interface User {
  id?: number;
  name: string;
  email: string;
}

interface AppContextType {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;

  darkMode: boolean;
  toggleDarkMode: () => void;
  includeWatchedInDraw: boolean;
  setIncludeWatchedInDraw: (value: boolean) => void;
  // Randomizer state
  results: Content[];
  isLoading: boolean;
  hasResults: boolean;
  draw: (filters: FilterOptions) => void;
  drawAgain: () => void;
  clearResults: () => void;
  lastFilters: FilterOptions | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Contexto global da aplicação
 * 
 * Gerencia:
 * - Tema dark/light
 * - Configurações do usuário
 * - Estado do sorteio (compartilhado entre páginas)
 */
export function AppProvider({ children }: AppProviderProps) {
  // Auth state
  const [user, setUser] = useState<User | null>(null);

  // Theme settings
  const [darkMode, setDarkMode] = useState(false);
  const [includeWatchedInDraw, setIncludeWatchedInDraw] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Randomizer state
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFilters, setLastFilters] = useState<FilterOptions | null>(null);
  const [catalog, setCatalog] = useState<Content[]>([]);

  // Carregar catálogo da API
  useEffect(() => {
    getContents().then(data => {
      setCatalog(data);
    });
  }, []);

  // Inicializar configurações do localStorage e Auth
  useEffect(() => {
    const settings = getSettings();
    setDarkMode(settings.darkMode);
    setIncludeWatchedInDraw(settings.includeWatchedInDraw);
    
    // Recuperar sessão
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao restaurar sessão:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Aplicar classe dark no html
  useEffect(() => {
    if (!isInitialized) return;

    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    saveSettings({ darkMode });
  }, [darkMode, isInitialized]);

  // Salvar configuração de incluir assistidos
  useEffect(() => {
    if (!isInitialized) return;
    saveSettings({ includeWatchedInDraw });
  }, [includeWatchedInDraw, isInitialized]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  /**
   * Realiza o sorteio baseado nos filtros
   */
  const performDraw = useCallback(async (filters: FilterOptions) => {
    setIsLoading(true);

    try {
      // Simular delay para animação de loading (opcional, já que a API tem delay natural)
      // Mas mantemos um mínimo para não piscar
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));
      
      // Sorteia uma página aleatória para variar os resultados
      const randomPage = Math.floor(Math.random() * 10) + 1;
      
      // Busca conteúdo da API (ou Mock, dependendo da config no serviço)
      const fetchPromise = discoverContent(filters.type, randomPage, filters);
      
      const [_, fetchedResults] = await Promise.all([minDelay, fetchPromise]);

      // IDs a excluir (assistidos, se configurado)
      const excludeIds = includeWatchedInDraw ? [] : getWatchedIds();

      // Filtrar itens já assistidos e garantir aleatoriedade extra
      const filtered = fetchedResults.filter(item => !excludeIds.includes(item.id));
      
      // Sortear 10 resultados finais
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const randomResults = shuffled.slice(0, 10);

      // Enriquecer com provedores de streaming (para os 10 finais)
      const enrichedResults = await Promise.all(
        randomResults.map(async (item) => {
          // Se já tiver streaming (mock), mantém. Se não, busca.
          if (item.streaming && item.streaming.length > 0) return item;
          
          try {
            const providers = await getWatchProviders(item.id, item.type);
            return { ...item, streaming: providers };
          } catch (e) {
            console.error(`Erro ao buscar providers para ${item.title}`, e);
            return item;
          }
        })
      );

      setResults(enrichedResults);
      setLastFilters(filters);
    } catch (error) {
      console.error('Erro ao realizar sorteio:', error);
      // Fallback ou tratamento de erro
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [includeWatchedInDraw]);

  /**
   * Realiza o sorteio inicial
   */
  const draw = useCallback((filters: FilterOptions) => {
    performDraw(filters);
  }, [performDraw]);

  /**
   * Sorteia novamente com os mesmos filtros
   */
  const drawAgain = useCallback(() => {
    if (lastFilters) {
      performDraw(lastFilters);
    }
  }, [lastFilters, performDraw]);

  /**
   * Limpa os resultados
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setLastFilters(null);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AppContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    darkMode,
    toggleDarkMode,
    includeWatchedInDraw,
    setIncludeWatchedInDraw,
    // Randomizer
    results,
    isLoading,
    hasResults: results.length > 0,
    draw,
    drawAgain,
    clearResults,
    lastFilters,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook para acessar o contexto da aplicação
 */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
