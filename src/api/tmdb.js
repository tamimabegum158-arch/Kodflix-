const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

export function hasApiKey() {
  return Boolean(import.meta.env.VITE_TMDB_API_KEY);
}

function getApiKey() {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      'TMDB API key not set. Add VITE_TMDB_API_KEY in your deployment environment variables (e.g. Vercel or Netlify project settings), or in a .env file when running locally.'
    );
  }
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

export function getBackdropUrl(backdropPath) {
  if (!backdropPath) return null;
  return `${BACKDROP_BASE}${backdropPath.startsWith('/') ? backdropPath : `/${backdropPath}`}`;
}

export async function getPopularMovies(page = 1, language = 'en-US') {
  const data = await fetchTmdb('/movie/popular', { language, page });
  return data.results ?? [];
}

export async function getNowPlaying(page = 1, language = 'en-US') {
  const data = await fetchTmdb('/movie/now_playing', { language, page });
  return data.results ?? [];
}

export async function getTrendingMovies(page = 1) {
  const data = await fetchTmdb('/trending/movie/day', { language: 'en-US' });
  return data.results ?? [];
}

export async function getTopRatedMovies(page = 1, language = 'en-US') {
  const data = await fetchTmdb('/movie/top_rated', { language, page });
  return data.results ?? [];
}

/** Discover movies - use withOriginalLanguage e.g. "en|hi|ko|es|fr|ja|te" for multiple languages */
export async function getDiscoverMovies(options = {}) {
  const { page = 1, sortBy = 'popularity.desc', withOriginalLanguage, region } = options;
  const params = { language: 'en-US', page, sort_by: sortBy };
  if (withOriginalLanguage) params.with_original_language = withOriginalLanguage;
  if (region) params.region = region;
  const data = await fetchTmdb('/discover/movie', params);
  return data.results ?? [];
}

/** Fetch many movies by original language (multiple pages combined). lang: 'hi' | 'kn' | 'en' */
export async function getMoviesByLanguage(lang, numPages = 4) {
  const pages = await Promise.all(
    Array.from({ length: numPages }, (_, i) =>
      getDiscoverMovies({ withOriginalLanguage: lang, page: i + 1 })
    )
  );
  const seen = new Set();
  return pages.flat().filter((m) => m?.id && !seen.has(m.id) && seen.add(m.id));
}

/** Get video keys (e.g. YouTube) for a movie - for trailers only (TMDB does not provide full movies) */
export async function getMovieVideos(movieId) {
  const data = await fetchTmdb(`/movie/${movieId}/videos`, { language: 'en-US' });
  const results = data.results ?? [];
  const trailer = results.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  return trailer ? trailer.key : null;
}

/** Search movies by title */
export async function searchMovies(query, page = 1) {
  if (!query?.trim()) return [];
  const data = await fetchTmdb('/search/movie', { query: query.trim(), language: 'en-US', page });
  return data.results ?? [];
}

/** TMDB movie page - see "Where to watch" for full movie streaming */
export function getMovieWatchLink(movieId) {
  return `https://www.themoviedb.org/movie/${movieId}/watch`;
}
