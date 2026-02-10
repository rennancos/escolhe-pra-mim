
import { useNavigate } from 'react-router-dom';
import type { FilterOptions } from '@/types';
import { FilterForm, LoadingSpinner } from '@/components/custom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Shuffle, 
  Film, 
  Tv, 
  Heart,
  Zap,
  Clock,
  Star
} from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { draw, isLoading } = useApp();
  const handleSubmit = (filters: FilterOptions) => {
    draw(filters);
    
    // Navegar para resultados após o loading
    setTimeout(() => {
      navigate('/results');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <LoadingSpinner 
          message="Sorteando suas opções..."
          subMessage="Escolhendo os melhores títulos para você"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 to-background dark:from-violet-950/20 dark:to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Descubra seu próximo favorito</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Escolhe Pra Mim
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Chega de passar horas escolhendo o que assistir. 
              Deixe o destino decidir por você com nosso sorteio inteligente de filmes e séries.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Film className="h-8 w-8 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-bold">30+</div>
                <div className="text-sm text-muted-foreground">Filmes</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Tv className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold">30+</div>
                <div className="text-sm text-muted-foreground">Séries</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">13</div>
                <div className="text-sm text-muted-foreground">Gêneros</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-muted-foreground">Streamings</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl" />
      </section>

      {/* Filter Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <FilterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Como funciona?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/50">
                <Shuffle className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Escolha seus filtros</h3>
              <p className="text-muted-foreground text-sm">
                Selecione o tipo, gêneros e serviços de streaming de sua preferência.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/50">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Faça o sorteio</h3>
              <p className="text-muted-foreground text-sm">
                Nosso algoritmo seleciona 10 opções aleatórias baseadas nos seus critérios.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/50">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Salve seus favoritos</h3>
              <p className="text-muted-foreground text-sm">
                Adicione à sua lista de "assistir depois" ou marque como já vistos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Recursos especiais
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50">
                    <Clock className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Lista de espera</h3>
                    <p className="text-sm text-muted-foreground">
                      Salve títulos interessantes para assistir quando quiser.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Histórico</h3>
                    <p className="text-sm text-muted-foreground">
                      Mantenha registro de tudo que você já assistiu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sorteio inteligente</h3>
                    <p className="text-sm text-muted-foreground">
                      Evita sugerir conteúdos que você já assistiu.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <Film className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Múltiplos streamings</h3>
                    <p className="text-sm text-muted-foreground">
                      Filtre por Netflix, HBO Max, Disney+, Prime Video e mais.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
