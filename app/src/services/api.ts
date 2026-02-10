import type { Content } from '@/types';

const API_URL = 'http://localhost:3000/api';

export async function getContents(): Promise<Content[]> {
  try {
    const response = await fetch(`${API_URL}/contents`);
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
