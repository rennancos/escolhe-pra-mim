"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("epm_history");
      const storedSaved = localStorage.getItem("epm_saved");
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("epm_history", JSON.stringify(history));
    }
  }, [history, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("epm_saved", JSON.stringify(saved));
    }
  }, [saved, isLoaded]);

  const addToHistory = (item) => {
    // Add unique history ID to allow same movie multiple times in history if drawn again
    const newItem = { 
      ...item, 
      watched: false, 
      historyId: crypto.randomUUID(), 
      timestamp: new Date().toISOString() 
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const removeFromHistory = (historyId) => {
    setHistory((prev) => prev.filter((item) => item.historyId !== historyId));
  };

  const toggleWatched = (historyId) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.historyId === historyId ? { ...item, watched: !item.watched } : item
      )
    );
  };

  const addToSaved = (item) => {
    // Prevent duplicates in saved list
    if (saved.some((s) => s.id === item.id)) return;
    setSaved((prev) => [item, ...prev]);
  };

  const removeFromSaved = (id) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        history,
        saved,
        addToHistory,
        removeFromHistory,
        toggleWatched,
        addToSaved,
        removeFromSaved,
        isLoaded
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
