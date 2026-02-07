export const env = {
  TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX: 60,
};

