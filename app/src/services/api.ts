import type { Content, FilterOptions } from '@/types';

const API_URL = 'http://localhost:3000/api';

export async function getContents(filters?: FilterOptions): Promise<Content[]> {
  try {
    let url = `${API_URL}/contents`;
    
    // Build query string if filters are provided
    if (filters) {
      const params = new URLSearchParams();
      
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      
      if (filters.genres && filters.genres.length > 0) {
        // Send as comma-separated values or repeated params depending on backend expectation
        // Our backend expects comma-separated or array. URLSearchParams usually does repeated keys for append()
        // But backend handles comma-separated string too. Let's use comma-separated for simplicity.
        params.append('genres', filters.genres.join(','));
      }
      
      if (filters.streaming && filters.streaming.length > 0) {
        params.append('streaming', filters.streaming.join(','));
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar conteúdos');
    }
    const data = await response.json();
    
    // Mapear dados da API para o formato do Frontend
    return data.map((item: any) => ({
      ...item,
      rating: item.rating ? Number(item.rating) : undefined,
      posterPath: item.poster_path || item.posterPath,
    }));
  } catch (error) {
    console.error('Erro na API:', error);
    return [];
  }
}

export async function registerUser(userData: { name: string; email: string; password: string }) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao cadastrar usuário');
    }
    
    return data;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }
    
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}
