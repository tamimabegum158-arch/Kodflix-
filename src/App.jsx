import { useCallback } from 'react';
import Header from './components/Header';
import MovieRow from './components/MovieRow';
import { getPopularMovies, getNowPlaying, getTrendingMovies } from './api/tmdb';
import './App.css';

function App() {
  const fetchPopular = useCallback(() => getPopularMovies(), []);
  const fetchNowPlaying = useCallback(() => getNowPlaying(), []);
  const fetchTrending = useCallback(() => getTrendingMovies(), []);

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <MovieRow title="Popular" fetchMovies={fetchPopular} />
        <MovieRow title="Now in Theaters" fetchMovies={fetchNowPlaying} />
        <MovieRow title="Trending Today" fetchMovies={fetchTrending} />
      </main>
    </div>
  );
}

export default App;
