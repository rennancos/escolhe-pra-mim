const TYPES = new Set(["movie", "series"]);

export function parseDiscoverQuery(url) {
  const params = url.searchParams;
  const type = params.get("type");
  const genres = (params.get("genres") || "")
    .split("|")
    .map((g) => g.trim())
    .filter(Boolean)
    .map((g) => Number(g))
    .filter((n) => Number.isFinite(n));
  const providers = (params.get("providers") || "")
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);

  const errors = [];
  if (!type || !TYPES.has(type)) errors.push({ field: "type", message: "Invalid type" });
  if (!providers.length) errors.push({ field: "providers", message: "At least one provider required" });
  if (!genres.length) errors.push({ field: "genres", message: "At least one genre required" });

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { type, genres, providers } };
}

