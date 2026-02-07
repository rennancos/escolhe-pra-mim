import { tmdbService } from "@/services/tmdbService";
import { ok, badRequest, serverError } from "@/utils/response";
import { rateLimit } from "@/middlewares/rateLimit";
import { VIRTUAL_GENRES } from "@/config/genres";

export async function GET(req) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  if (!type || !["movie", "series"].includes(type)) {
    return badRequest("Invalid type");
  }
  try {
    const genres = await tmdbService.getGenres(type);
    // Acrescenta gêneros virtuais (aliases/combinações) sem duplicar nomes existentes
    const names = new Set(genres.map((g) => g.name));
    const virtual = VIRTUAL_GENRES.filter((g) => !names.has(g.name)).map(({ id, name }) => ({ id, name }));
    return ok([...genres, ...virtual]);
  } catch {
    return serverError("Genres fetch failed");
  }
}
