"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterForm } from "@/components/FilterForm";
import { ResultCard } from "@/components/ResultCard";
import { HistoryList } from "@/components/HistoryList";
import { SavedList } from "@/components/SavedList";
import { useApp } from "@/utils/AppContext";
import { tmdb } from "@/services/tmdb";
import { History, Bookmark } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const { history, saved, addToHistory, removeFromHistory, toggleWatched, addToSaved, removeFromSaved, isLoaded } = useApp();
  const [currentResults, setCurrentResults] = useState(null); // Changed to array
  const [activeTab, setActiveTab] = useState("history"); // history | saved
  const [noResult, setNoResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters) => {
    setLoading(true);
    setNoResult(false);
    setCurrentResults(null);
    
    // TMDB API Search
    // filters: { type: 'movie'|'series', genres: number[], streaming: string[] }
    // tmdb.discover expects: { type, genres, providers }
    // We map streaming (names) to providers (names) which is 1:1 in our case, 
    // but the discover function handles the name-to-ID mapping internally.
    
    const results = await tmdb.discover({
      type: filters.type,
      genres: filters.genres,
      providers: filters.streaming
    });

    if (!results || results.length === 0) {
      setNoResult(true);
      setLoading(false);
      return;
    }

    setCurrentResults(results);
    // Add all to history
    results.forEach(item => addToHistory(item));
    setLoading(false);
    
    // Scroll to top or result
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setCurrentResults(null);
    setNoResult(false);
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Background Ambience (disabled for performance) */}

      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 space-y-20 relative z-10">
        
        {/* Hero / Main Interaction Area */}
        <section className="flex flex-col items-center justify-center space-y-12 animate-fade-in">
          {!currentResults ? (
            <>
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wider uppercase mb-4 shadow-sm backdrop-blur-sm">
                  ✨ Pare de scrollar, comece a assistir
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                  Indeciso hoje? <br/>
                  <span className="text-gradient">Deixe a sorte decidir!</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                  Selecione suas preferências e receba recomendações perfeitas para sua próxima maratona.
                </p>
              </div>

              <FilterForm onSearch={handleSearch} isLoading={loading} />
              
              {noResult && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium">
                  😢 Nenhum título encontrado com esses filtros. Tente adicionar mais opções!
                </div>
              )}
            </>
          ) : (
            <div className="w-full max-w-6xl space-y-12">
              <div className="flex items-center justify-between glass p-4 rounded-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🎉 Aqui estão suas <span className="text-primary">10 sugestões</span>:
                </h2>
                <button 
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all font-medium text-sm"
                >
                  Voltar aos filtros
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {currentResults.map((result) => (
                  <ResultCard 
                    key={result.id}
                    result={result} 
                    onReset={null} 
                    onSave={addToSaved}
                    isSaved={saved.some(s => s.id === result.id)}
                  />
                ))}
              </div>

              <div className="flex justify-center pt-8 pb-12">
                <button 
                  onClick={handleReset}
                  className="px-10 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 transition-all text-lg flex items-center gap-2"
                >
                   🎲 Sortear Novamente
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Lists Section */}
        <section className="max-w-4xl mx-auto w-full pt-12 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 mb-10 bg-secondary/30 p-1.5 rounded-2xl w-fit mx-auto backdrop-blur-sm border border-white/5">
            <button
              onClick={() => setActiveTab("history")}
              className={clsx(
                "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2.5 text-sm",
                activeTab === "history"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <History size={18} strokeWidth={2.5} />
              Histórico
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={clsx(
                "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2.5 text-sm",
                activeTab === "saved"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <Bookmark size={18} strokeWidth={2.5} />
              Salvos
            </button>
          </div>

          <div className="animate-fade-in min-h-[300px]">
            {activeTab === "history" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <History size={24} />
                    </div>
                    Últimos sorteios
                  </h3>
                  <span className="text-sm font-medium px-3 py-1 bg-secondary rounded-full text-muted-foreground">{history.length} itens</span>
                </div>
                <HistoryList 
                  history={history} 
                  onToggleWatched={toggleWatched} 
                  onRemove={removeFromHistory} 
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Bookmark size={24} />
                    </div>
                    Lista de interesses
                  </h3>
                  <span className="text-sm font-medium px-3 py-1 bg-secondary rounded-full text-muted-foreground">{saved.length} itens</span>
                </div>
                <SavedList 
                  saved={saved} 
                  onRemove={removeFromSaved} 
                />
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
