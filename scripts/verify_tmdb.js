
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function verify() {
  console.log("Verifying TMDB API...");
  if (!API_KEY) {
    console.error("TMDB_API_KEY não configurada.");
    return;
  }

  // 1. Check Configuration/Authentication (implied by any successful call)
  try {
    const genreRes = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
    const genreData = await genreRes.json();
    if (genreData.genres && genreData.genres.length > 0) {
      console.log("✅ Genres fetched successfully.");
    } else {
      console.error("❌ Failed to fetch genres:", genreData);
    }
  } catch (e) {
    console.error("❌ Error fetching genres:", e.message);
  }

  // 2. Check Discovery
  try {
    // Discovery with provider (Netflix = 8)
    const discoverUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&watch_region=BR&with_watch_providers=8&sort_by=popularity.desc`;
    const discRes = await fetch(discoverUrl);
    const discData = await discRes.json();
    
    if (discData.results && discData.results.length > 0) {
      console.log(`✅ Discovery fetched ${discData.results.length} results.`);
      const firstId = discData.results[0].id;
      
      // 3. Check Details & Providers for first item
      const detailsRes = await fetch(`${BASE_URL}/movie/${firstId}?api_key=${API_KEY}&language=pt-BR`);
      const detailsData = await detailsRes.json();
      console.log(`✅ Details fetched for "${detailsData.title}".`);

      const providersRes = await fetch(`${BASE_URL}/movie/${firstId}/watch/providers?api_key=${API_KEY}`);
      const providersData = await providersRes.json();
      if (providersData.results && providersData.results.BR) {
        console.log("✅ Watch providers fetched for BR:", providersData.results.BR.flatrate?.map(p => p.provider_name));
      } else {
        console.warn("⚠️ No BR providers found for this item (might be normal).");
      }

    } else {
      console.error("❌ Discovery returned no results:", discData);
    }
  } catch (e) {
    console.error("❌ Error during discovery/details:", e.message);
  }
}

verify();
