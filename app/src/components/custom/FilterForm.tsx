import { useState } from 'react';
import type { FilterOptions, ContentType } from '@/types';
import { GENRES, STREAMING_SERVICES } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Film,
  Tv,
  Shuffle,
  Sparkles,
  Clapperboard,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface FilterFormProps {
  onSubmit: (filters: FilterOptions) => void;
  isLoading?: boolean;
}

export function FilterForm({ onSubmit, isLoading = false }: FilterFormProps) {
  const [type, setType] = useState<ContentType | 'all'>('all');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStreaming, setSelectedStreaming] = useState<string[]>([]);
  const { includeWatchedInDraw, setIncludeWatchedInDraw } = useApp();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleStreaming = (service: string) => {
    setSelectedStreaming((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      type,
      genres: selectedGenres,
      streaming: selectedStreaming,
    });
  };

  const hasSelection = selectedGenres.length > 0 || selectedStreaming.length > 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl md:text-3xl">
          O que vamos assistir hoje?
        </CardTitle>
        <CardDescription className="text-base">
          Selecione seus filtros e deixe o destino escolher por você
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tipo de Conteúdo */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Tipo de conteúdo</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={type === 'all' ? 'default' : 'outline'}
              className="flex-col h-auto py-3 gap-2"
              onClick={() => setType('all')}
            >
              <Clapperboard className="h-5 w-5" />
              <span className="text-xs">Tudo</span>
            </Button>
            <Button
              type="button"
              variant={type === 'movie' ? 'default' : 'outline'}
              className="flex-col h-auto py-3 gap-2"
              onClick={() => setType('movie')}
            >
              <Film className="h-5 w-5" />
              <span className="text-xs">Filmes</span>
            </Button>
            <Button
              type="button"
              variant={type === 'series' ? 'default' : 'outline'}
              className="flex-col h-auto py-3 gap-2"
              onClick={() => setType('series')}
            >
              <Tv className="h-5 w-5" />
              <span className="text-xs">Séries</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Gêneros */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Gêneros</Label>
            {selectedGenres.length > 0 && (
              <Badge variant="secondary">{selectedGenres.length} selecionados</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Button
                key={genre}
                type="button"
                variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                size="sm"
                className={`text-xs transition-all ${
                  selectedGenres.includes(genre)
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'hover:border-violet-400 hover:text-violet-600'
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {selectedGenres.includes(genre) && (
                  <Check className="mr-1 h-3 w-3" />
                )}
                {genre}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Streaming */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Onde assistir</Label>
            {selectedStreaming.length > 0 && (
              <Badge variant="secondary">{selectedStreaming.length} selecionados</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {STREAMING_SERVICES.map((service) => (
              <Button
                key={service}
                type="button"
                variant={selectedStreaming.includes(service) ? 'default' : 'outline'}
                size="sm"
                className={`text-xs transition-all ${
                  selectedStreaming.includes(service)
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'hover:border-indigo-400 hover:text-indigo-600'
                }`}
                onClick={() => toggleStreaming(service)}
              >
                {selectedStreaming.includes(service) && (
                  <Check className="mr-1 h-3 w-3" />
                )}
                {service}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Configurações */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="include-watched" className="text-sm font-medium">
              Incluir já assistidos
            </Label>
            <p className="text-xs text-muted-foreground">
              Permitir que títulos marcados como assistidos apareçam no sorteio
            </p>
          </div>
          <Switch
            id="include-watched"
            checked={includeWatchedInDraw}
            onCheckedChange={setIncludeWatchedInDraw}
          />
        </div>

        {/* Botão de Sortear */}
        <Button
          size="lg"
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sorteando...
            </div>
          ) : (
            <>
              <Shuffle className="mr-2 h-5 w-5" />
              Sortear{hasSelection ? ' com Filtros' : ' Aleatório'}
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {hasSelection
            ? 'Vamos buscar opções que combinam com seus filtros!'
            : 'Sem filtros? Vamos sortear de todo o catálogo!'}
        </p>
      </CardContent>
    </Card>
  );
}

export default FilterForm;
