import { VIRTUAL_GENRES, STATIC_GENRES } from "@/config/genres";
import { STREAMING_SERVICES } from "@/config/providers";

async function getGenres(type) {
  try {
    const res = await fetch(`/api/v1/genres?type=${type}`);
    if (!res.ok) throw new Error("Failed to fetch genres");
    const data = await res.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return STATIC_GENRES[type] || [];
  }
}

async function discover({ type, genres, providers }) {
  try {
    const params = new URLSearchParams({
      type,
      genres: genres.join(","),
      providers: providers.join(","),
    });

    const res = await fetch(`/api/v1/discover?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Discovery error:", error);
    return [];
  }
}

export { STREAMING_SERVICES };

export const tmdb = {
  discover,
  getGenres,
};
