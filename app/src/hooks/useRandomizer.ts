import { useApp } from '@/context/AppContext';

/**
 * Hook personalizado para gerenciar o sorteio de conteúdo
 * 
 * Este hook agora usa o contexto global para compartilhar
 * o estado do sorteio entre as páginas.
 */
export function useRandomizer() {
  const app = useApp();
  
  return {
    results: app.results,
    isLoading: app.isLoading,
    hasResults: app.hasResults,
    draw: app.draw,
    drawAgain: app.drawAgain,
    clearResults: app.clearResults,
    lastFilters: app.lastFilters,
  };
}

export default useRandomizer;
