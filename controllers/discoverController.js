import { tmdbService } from "@/services/tmdbService";
import { ok, badRequest, serverError } from "@/utils/response";
import { rateLimit } from "@/middlewares/rateLimit";
import { parseDiscoverQuery } from "@/dtos/discoverDTO";

export async function GET(req) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const url = new URL(req.url);
  const parsed = parseDiscoverQuery(url);
  if (!parsed.ok) {
    return badRequest("Invalid query", parsed.errors);
  }

  try {
    const results = await tmdbService.discover(parsed.data);
    return ok(results);
  } catch (err) {
    return serverError("Discover failed");
  }
}
