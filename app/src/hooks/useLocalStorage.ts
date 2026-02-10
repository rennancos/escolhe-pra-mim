import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para sincronizar estado com localStorage
 * 
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial
 * @returns [value, setValue] - Estado e função para atualizar
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializar do localStorage apenas no cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Função para atualizar o valor
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Permitir valor como função
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Salvar no estado
        setStoredValue(valueToStore);
        
        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
