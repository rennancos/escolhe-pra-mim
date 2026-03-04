import type { Content, FilterOptions } from '@/types';

const API_URL = 'http://localhost:3000/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper para fetch com credentials
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Envia e recebe cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  return response;
}

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
    const response = await fetchWithAuth(`${API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao cadastrar usuário');
    }
    
    return {
      user: {
        id: data._id,
        name: data.name,
        email: data.email
      }
    };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await fetchWithAuth(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer login');
    }
    
    return {
      user: {
        id: data._id,
        name: data.name,
        email: data.email
      }
    };
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await fetchWithAuth(`${API_URL}/logout`);
  } catch (error) {
    console.error('Erro no logout:', error);
  }
}

export async function getMe() {
  try {
    const response = await fetchWithAuth(`${API_URL}/me`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// --- Listas do Usuário ---

export async function getUserLists() {
  try {
    const response = await fetchWithAuth(`${API_URL}/lists`);
    
    if (!response.ok) throw new Error('Erro ao buscar listas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar listas do usuário:', error);
    throw error;
  }
}

export async function addToList(content: Content, listType: 'watchlist' | 'watched') {
  try {
    const response = await fetchWithAuth(`${API_URL}/lists`, {
      method: 'POST',
      body: JSON.stringify({ content, listType })
    });
    
    if (!response.ok) throw new Error('Erro ao adicionar à lista');
    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar à lista:', error);
    throw error;
  }
}

export async function removeFromList(contentId: number, listType: 'watchlist' | 'watched') {
  try {
    const response = await fetchWithAuth(`${API_URL}/lists/${contentId}/${listType}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Erro ao remover da lista');
    return await response.json();
  } catch (error) {
    console.error('Erro ao remover da lista:', error);
    throw error;
  }
}
