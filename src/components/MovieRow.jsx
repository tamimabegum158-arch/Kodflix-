import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

export default function MovieRow({ title, fetchMovies, onMovieClick, movies: moviesProp }) {
  const [movies, setMovies] = useState(moviesProp ?? []);
  const [loading, setLoading] = useState(!moviesProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (moviesProp != null) {
      setMovies(moviesProp);
      setLoading(false);
      setError(null);
      return;
    }
    if (!fetchMovies) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMovies()
      .then((data) => {
        if (!cancelled) setMovies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchMovies, moviesProp]);

  if (loading) {
    return (
      <section className="movie-row">
        <h2 className="movie-row-title">{title}</h2>
        <div className="movie-row-list movie-row-loading">Loading…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="movie-row">
        <h2 className="movie-row-title">{title}</h2>
        <div className="movie-row-list movie-row-error">{error}</div>
      </section>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
}
