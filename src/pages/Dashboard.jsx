import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import MovieDetail from '../components/MovieDetail';
import {
  hasApiKey,
  getTrendingMovies,
  getPopularMovies,
  getNowPlaying,
  getTopRatedMovies,
  getDiscoverMovies,
  getMoviesByLanguage,
  searchMovies,
  getBackdropUrl,
} from '../api/tmdb';
import '../App.css';
import './Dashboard.css';

const SEARCH_DEBOUNCE_MS = 350;

export default function Dashboard() {
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchTrending = useCallback(() => getTrendingMovies(), []);
  const fetchPopular = useCallback(() => getPopularMovies(), []);
  const fetchNowPlaying = useCallback(() => getNowPlaying(), []);
  const fetchTopRated = useCallback(() => getTopRatedMovies(), []);
  const fetchAllLanguages = useCallback(
    () => getDiscoverMovies({ withOriginalLanguage: 'en|hi|ko|es|fr|ja|te|zh' }),
    []
  );
  const fetchHindi = useCallback(() => getMoviesByLanguage('hi'), []);
  const fetchKannada = useCallback(() => getMoviesByLanguage('kn'), []);
  const fetchEnglish = useCallback(() => getMoviesByLanguage('en'), []);

  useEffect(() => {
    let cancelled = false;
    getTrendingMovies()
      .then((results) => {
        if (!cancelled && results?.length) setHeroMovie(results[0]);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setSearchLoading(true);
      searchMovies(searchQuery)
        .then((results) => setSearchResults(results ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  if (!hasApiKey()) {
    return (
      <div className="app">
        <Header />
        <main className="app-main">
          <div className="app-api-key-banner">
            <p><strong>TMDB API key not configured</strong></p>
            <p>Add <code>VITE_TMDB_API_KEY</code> in your deployment environment or in a <code>.env</code> file.</p>
          </div>
        </main>
      </div>
    );
  }

  const heroBackdrop = heroMovie ? getBackdropUrl(heroMovie.backdrop_path) : null;

  return (
    <div className="app">
      <Header />
      <main className="app-main dashboard-main">
        {/* Hero banner */}
        <section className="dashboard-hero">
          <div
            className="dashboard-hero-backdrop"
            style={
              heroBackdrop
                ? { backgroundImage: `linear-gradient(to top, #141414 0%, transparent 50%, rgba(0,0,0,0.4) 100%), url(${heroBackdrop})` }
                : {}
            }
          />
          <div className="dashboard-hero-content">
            <h1 className="dashboard-hero-title">{heroMovie?.title ?? 'Welcome to Kodflix'}</h1>
            <p className="dashboard-hero-overview">
              {heroMovie?.overview
                ? heroMovie.overview.slice(0, 180) + (heroMovie.overview.length > 180 ? '…' : '')
                : 'Discover movies and series.'}
            </p>
            <div className="dashboard-hero-actions">
              <button
                type="button"
                className="dashboard-hero-btn dashboard-hero-btn-play"
                onClick={() => heroMovie && setSelectedMovie(heroMovie)}
              >
                ▶ Play
              </button>
              <button
                type="button"
                className="dashboard-hero-btn dashboard-hero-btn-list"
                onClick={() => heroMovie && setSelectedMovie(heroMovie)}
              >
                + My List
              </button>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="dashboard-search">
          <input
            type="search"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search-input"
            aria-label="Search movies"
          />
          {searchLoading && <span className="dashboard-search-status">Searching…</span>}
        </section>

        {/* Search results */}
        {searchQuery.trim() && (
          <>
            {!searchLoading && searchResults.length === 0 && (
              <p className="dashboard-search-empty">No movies found for "{searchQuery}". Try a different search.</p>
            )}
            {(searchLoading || searchResults.length > 0) && (
              <MovieRow
                title={searchLoading ? 'Searching…' : `Search results for "${searchQuery}"`}
                movies={searchResults}
                onMovieClick={setSelectedMovie}
              />
            )}
          </>
        )}

        {/* Movie rows */}
        <MovieRow title="Trending Now" fetchMovies={fetchTrending} onMovieClick={setSelectedMovie} />
        <MovieRow title="Popular" fetchMovies={fetchPopular} onMovieClick={setSelectedMovie} />
        <MovieRow title="Now in Theaters" fetchMovies={fetchNowPlaying} onMovieClick={setSelectedMovie} />
        <MovieRow title="Top Rated" fetchMovies={fetchTopRated} onMovieClick={setSelectedMovie} />

        <MovieRow title="Hindi Movies" fetchMovies={fetchHindi} onMovieClick={setSelectedMovie} />
        <MovieRow title="Kannada Movies" fetchMovies={fetchKannada} onMovieClick={setSelectedMovie} />
        <MovieRow title="English Movies" fetchMovies={fetchEnglish} onMovieClick={setSelectedMovie} />

        <MovieRow title="From around the world" fetchMovies={fetchAllLanguages} onMovieClick={setSelectedMovie} />
      </main>

      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
