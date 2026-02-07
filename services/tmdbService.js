import { env } from "@/config/env";
import { VIRTUAL_GENRES, STATIC_GENRES } from "@/config/genres";
import { PROVIDERS_MAP } from "@/config/providers";
import { mockData } from "@/data/mockData";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const IMAGE_BACKDROP_BASE = "https://image.tmdb.org/t/p/w500";

const image = {
  poster(path) {
    if (!path) return null;
    return `${IMAGE_POSTER_BASE}${path}`;
  },
  backdrop(path) {
    if (!path) return null;
    return `${IMAGE_BACKDROP_BASE}${path}`;
  },
};

function normalize(item, type) {
  return {
    id: item.id,
    title: item.title || item.name,
    type,
    overview: item.overview,
    poster_path: image.poster(item.poster_path),
    backdrop_path: image.backdrop(item.backdrop_path),
    release_date: item.release_date || item.first_air_date,
    vote_average: item.vote_average,
    genres: [],
    streaming: [],
  };
}

async function getGenres(type) {
  if (!env.TMDB_API_KEY) {
    return STATIC_GENRES[type] || [];
  }
  const endpoint = type === "series" ? "tv" : "movie";
  try {
    const res = await fetch(
      `${BASE_URL}/genre/${endpoint}/list?api_key=${env.TMDB_API_KEY}&language=pt-BR`
    );
    const data = await res.json();
    return data.genres || [];
  } catch {
    return STATIC_GENRES[type] || [];
  }
}

async function getWatchProviders(id, type) {
  if (!env.TMDB_API_KEY) return [];
  const endpoint = type === "series" ? "tv" : "movie";
  try {
    const res = await fetch(
      `${BASE_URL}/${endpoint}/${id}/watch/providers?api_key=${env.TMDB_API_KEY}`
    );
    const data = await res.json();
    const br = data.results?.BR;
    if (!br || !br.flatrate) return [];
    return br.flatrate
      .filter((p) => Object.values(PROVIDERS_MAP).includes(p.provider_id))
      .map((p) => p.provider_name);
  } catch {
    return [];
  }
}

function expandGenres(input) {
  const set = new Set();
  for (const id of input) {
    if (id >= 0) {
      set.add(id);
    } else {
      const v = VIRTUAL_GENRES.find((g) => g.id === id);
      if (v) {
        for (const real of v.map) set.add(real);
      }
    }
  }
  return Array.from(set);
}

function idsToNames(inputIds, type) {
  const names = new Set();
  for (const id of inputIds) {
    if (id >= 0) {
      const g = (STATIC_GENRES[type] || []).find((x) => x.id === id);
      if (g) names.add(g.name);
    } else {
      const v = VIRTUAL_GENRES.find((x) => x.id === id);
      if (v) {
        for (const realId of v.map) {
          const g = (STATIC_GENRES[type] || []).find((x) => x.id === realId);
          if (g) names.add(g.name);
        }
      }
    }
  }
  return Array.from(names);
}

async function discover({ type, genres, providers }) {
  if (!env.TMDB_API_KEY) {
    // Fallback local usando mockData
    const genreNames = idsToNames(genres, type);
    const filtered = mockData.filter((item) => {
      if (item.type !== type) return false;
      const hasProvider = providers.some((p) => item.streaming.includes(p));
      const hasGenre = genreNames.length === 0 ? true : item.genres.some((g) => genreNames.includes(g));
      return hasProvider && hasGenre;
    });
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      overview: item.overview,
      poster_path: null,
      backdrop_path: null,
      release_date: null,
      vote_average: null,
      genres: item.genres,
      streaming: item.streaming,
    }));
  }

  const endpoint = type === "series" ? "tv" : "movie";
  const providerIds = providers
    .map((p) => PROVIDERS_MAP[p])
    .filter(Boolean)
    .join("|");

  const expanded = expandGenres(genres);

  async function fetchDiscover(searchParams) {
    const res = await fetch(`${BASE_URL}/discover/${endpoint}?${searchParams.toString()}`);
    return res.json();
  }

  const params = new URLSearchParams({
    api_key: env.TMDB_API_KEY,
    language: "pt-BR",
    watch_region: "BR",
    with_watch_providers: providerIds,
    with_genres: expanded.join("|"),
    sort_by: "popularity.desc",
    "vote_count.gte": "50",
    page: "1",
  });

  try {
    let initialData = await fetchDiscover(params);
    if (!initialData.total_pages || initialData.total_pages === 0) {
      params.delete("vote_count.gte");
      initialData = await fetchDiscover(params);
    }
    if (!initialData.total_pages || initialData.total_pages === 0) {
      params.delete("with_genres");
      initialData = await fetchDiscover(params);
    }
    const totalPages = Math.min(initialData.total_pages || 0, 50);
    if (totalPages === 0) return [];

    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    params.set("page", String(randomPage));

    const finalData = await fetchDiscover(params);
    const results = finalData.results || [];
    if (!results.length) return [];

    const shuffled = results.sort(() => 0.5 - Math.random()).slice(0, 10);
    const detailed = await Promise.all(
      shuffled.map(async (item) => {
        try {
          const [detailsData, streaming] = await Promise.all([
            fetch(`${BASE_URL}/${endpoint}/${item.id}?api_key=${env.TMDB_API_KEY}&language=pt-BR`).then((r) => r.json()),
            getWatchProviders(item.id, type),
          ]);
          const r = normalize(detailsData, type);
          r.streaming = streaming;
          r.genres = detailsData.genres ? detailsData.genres.map((g) => g.name) : [];
          return r;
        } catch {
          return null;
        }
      })
    );
    return detailed.filter(Boolean);
  } catch (error) {
    console.error("Discovery error:", error);
    return [];
  }
}

export const tmdbService = {
  discover,
  getGenres,
};
