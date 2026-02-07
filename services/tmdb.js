import { STREAMING_SERVICES } from "@/config/providers";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

export const tmdb = {
  getGenres: async (type) => {
    try {
      const res = await fetch(`/api/v1/genres?type=${encodeURIComponent(type)}`);
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  getWatchProviders: async (id, type) => {
    return [];
  },

  discover: async ({ type, genres, providers }) => {
    try {
      const params = new URLSearchParams({
        type,
        genres: genres.join("|"),
        providers: providers.join("|"),
      });
      const res = await fetch(`/api/v1/discover?${params.toString()}`);
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },
  
  getImageUrl: (path) => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}${path}`;
  }
};

export { STREAMING_SERVICES };
