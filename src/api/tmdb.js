const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function getApiKey() {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key) throw new Error('Missing VITE_TMDB_API_KEY in .env');
  return key;
}

async function fetchTmdb(path, params = {}) {
  const key = getApiKey();
  const search = new URLSearchParams({ api_key: key, ...params });
  const url = `${TMDB_BASE}${path}?${search}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  return `${IMAGE_BASE}${posterPath.startsWith('/') ? posterPath : `/${posterPath}`}`;
}

export async function getPopularMovies(page = 1) {
  const data = await fetchTmdb('/movie/popular', { language: 'en-US', page });
  return data.results ?? [];
}

export async function getNowPlaying(page = 1) {
  const data = await fetchTmdb('/movie/now_playing', { language: 'en-US', page });
  return data.results ?? [];
}

export async function getTrendingMovies() {
  const data = await fetchTmdb('/trending/movie/day');
  return data.results ?? [];
}
