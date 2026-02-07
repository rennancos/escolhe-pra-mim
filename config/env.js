export const env = {
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
};

