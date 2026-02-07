import { getGenres } from "@/controllers/genresController";

export async function GET(request) {
  return getGenres(request);
}
