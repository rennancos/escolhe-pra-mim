import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Content, ContentType } from '@/types';
import { ContentCard, EmptyState } from '@/components/custom';
import { useUserLists } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle, 
  ArrowLeft, 
  Trash2,
  Film,
  Tv,
  SortAsc,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'rating_desc';

export function Watched() {
  const navigate = useNavigate();
  const { 
    lists, 
    removeFromWatched,
    addToWatchlist,
    isInWatchlist
  } = useUserLists();

  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');

  const handleRemove = (contentId: number, title: string) => {
    removeFromWatched(contentId);
    toast.success('Removido do histórico', {
      description: `"${title}" foi removido da sua lista de assistidos.`,
    });
  };

  const handleWatchAgain = (content: Content) => {
    addToWatchlist(content);
    toast.success('Adicionado à lista!', {
      description: `"${content.title}" foi salvo para assistir novamente.`,
    });
  };

  const handleClearAll = () => {
    lists.watched.forEach(item => removeFromWatched(item.content.id));
    toast.success('Histórico limpo', {
      description: 'Todos os títulos foram removidos do seu histórico.',
    });
  };

  const filteredAndSortedList = useMemo(() => {
    let result = [...lists.watched];

    // Filter
    if (filterType !== 'all') {
      result = result.filter(item => item.content.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'date_asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'title_asc':
          return a.content.title.localeCompare(b.content.title);
        case 'rating_desc':
          return (b.content.rating || 0) - (a.content.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [lists.watched, filterType, sortBy]);

  const watchedCount = lists.watched.length;
  const movieCount = lists.watched.filter(item => item.content.type === 'movie').length;
  const seriesCount = lists.watched.filter(item => item.content.type === 'series').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <CheckCircle className="h-7 w-7 text-green-600" />
              Já Assistidos
            </h1>
            <p className="text-muted-foreground mt-1">
              {watchedCount === 0 
                ? 'Seu histórico está vazio'
                : `Você assistiu ${watchedCount} título${watchedCount !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {watchedCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpar Histórico
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar histórico?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover todos os {watchedCount} títulos do seu histórico?
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                      Sim, limpar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Filters & Stats Bar */}
        {watchedCount > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 bg-white dark:bg-slate-800 border">
                <Film className="mr-1 h-3 w-3 text-violet-500" />
                {movieCount} Filmes
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-white dark:bg-slate-800 border">
                <Tv className="mr-1 h-3 w-3 text-indigo-500" />
                {seriesCount} Séries
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={(v) => setFilterType(v as ContentType | 'all')}>
                  <SelectTrigger className="w-[130px] h-9 bg-background">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="movie">Filmes</SelectItem>
                    <SelectItem value="series">Séries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px] h-9 bg-background">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Adicionado (Recente)</SelectItem>
                    <SelectItem value="date_asc">Adicionado (Antigo)</SelectItem>
                    <SelectItem value="rating_desc">Melhor Avaliados</SelectItem>
                    <SelectItem value="title_asc">Título (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {watchedCount === 0 ? (
        <EmptyState
          variant="empty-watched"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredAndSortedList.map(({ content }) => (
              <ContentCard
                key={content.id}
                content={content}
                isInWatchlist={isInWatchlist(content.id)}
                isWatched={true}
                onAddToWatchlist={handleWatchAgain}
                onMarkAsWatched={() => {}}
                onRemoveFromWatchlist={() => {}}
                onRemoveFromWatched={(id) => handleRemove(id, content.title)}
              />
            ))}
          </div>

          {filteredAndSortedList.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum item encontrado com os filtros selecionados.</p>
              <Button 
                variant="link" 
                onClick={() => setFilterType('all')}
                className="mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Watched;
