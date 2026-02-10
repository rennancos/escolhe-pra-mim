const apiKey = process.env.TMDB_API_KEY;
const region = 'BR';

async function fetchProviders() {
  if (!apiKey) {
    console.error("TMDB_API_KEY não configurada.");
    return;
  }
  const url = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${apiKey}&watch_region=${region}`;
  const response = await fetch(url);
  const data = await response.json();
  
  const targets = [
    "Netflix", 
    "Globoplay", 
    "HBO", // Max usually contains HBO or Max
    "Max",
    "Disney", 
    "Amazon Prime Video", 
    "Apple TV", 
    "Mercado Play"
  ];

  const results = data.results.filter(p => 
    targets.some(t => p.provider_name.toLowerCase().includes(t.toLowerCase()))
  );

  console.log("Found Providers:", JSON.stringify(results.map(p => ({name: p.provider_name, id: p.provider_id})), null, 2));
}

fetchProviders();
