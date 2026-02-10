import { useNavigate } from 'react-router-dom';
import type { Content } from '@/types';
import { ContentCard, EmptyState, LoadingSpinner } from '@/components/custom';
import { useApp } from '@/context/AppContext';
import { useUserLists } from '@/hooks';
import { Button } from '@/components/ui/button';

import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  Shuffle, 
  ArrowLeft, 
  Sparkles,
  Check,
  Bookmark,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export function Results() {
  const navigate = useNavigate();
  const { results, hasResults, isLoading, drawAgain } = useApp();
  const { 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    markAsWatched,
    removeFromWatched,
    isWatched 
  } = useUserLists();


  const handleAddToWatchlist = (content: Content) => {
    const success = addToWatchlist(content);
    if (success) {
      toast.success('Adicionado à lista!', {
        description: `"${content.title}" foi salvo para assistir depois.`,
      });
    } else {
      toast.error('Já está na lista', {
        description: `"${content.title}" já foi adicionado anteriormente.`,
      });
    }
  };

  const handleMarkAsWatched = (content: Content) => {
    const success = markAsWatched(content);
    if (success) {
      toast.success('Marcado como assistido!', {
        description: `"${content.title}" foi adicionado ao seu histórico.`,
      });
    } else {
      toast.error('Já foi assistido', {
        description: `"${content.title}" já está no seu histórico.`,
      });
    }
  };

  const handleDrawAgain = () => {
    drawAgain();
  };

  // Se estiver carregando, mostrar spinner
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner 
          message="Sorteando novas opções..."
          subMessage="Buscando mais títulos para você"
        />
      </div>
    );
  }

  // Se não houver resultados, mostrar empty state
  if (!hasResults || results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <EmptyState
          variant="no-results"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Button
            variant="ghost"
            className="mb-2 -ml-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-violet-600" />
            Resultados do Sorteio
          </h1>
          <p className="text-muted-foreground mt-1">
            Encontramos {results.length} opções para você
          </p>
        </div>

        <Button
          onClick={handleDrawAgain}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Sortear Novamente
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="mb-8 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">
                {results.length}
              </div>
              <span className="text-muted-foreground">opções encontradas</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-violet-600" />
              <span className="text-muted-foreground">
                Clique no ícone de bookmark para salvar
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                Marque como assistido quando terminar
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {results.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            isInWatchlist={isInWatchlist(content.id)}
            isWatched={isWatched(content.id)}
            onAddToWatchlist={handleAddToWatchlist}
            onMarkAsWatched={handleMarkAsWatched}
            onRemoveFromWatchlist={removeFromWatchlist}
            onRemoveFromWatched={removeFromWatched}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Não gostou dessas opções?
        </p>
        <Button
          size="lg"
          onClick={handleDrawAgain}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <Shuffle className="mr-2 h-5 w-5" />
          Sortear Novamente
        </Button>
      </div>
    </div>
  );
}

export default Results;
