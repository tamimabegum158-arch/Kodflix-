import { getPosterUrl } from '../api/tmdb';
import './MovieCard.css';

const PLACEHOLDER_POSTER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"%3E%3Crect fill="%23333" width="500" height="750"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="24"%3ENo poster%3C/text%3E%3C/svg%3E';

function isNewRelease(releaseDate) {
  if (!releaseDate) return false;
  const release = new Date(releaseDate);
  const now = new Date();
  const daysDiff = (now - release) / (1000 * 60 * 60 * 24);
  return daysDiff >= 0 && daysDiff <= 60;
}

export default function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.poster_path) || PLACEHOLDER_POSTER;
  const showNew = isNewRelease(movie.release_date);

  return (
    <div className="movie-card">
      <div className="movie-card-poster-wrap">
        <img
          className="movie-card-poster"
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
        />
        <span className="movie-card-netflix-badge">NETFLIX</span>
        {showNew && <span className="movie-card-new-badge">NEW</span>}
      </div>
      <p className="movie-card-title">{movie.title}</p>
    </div>
  );
}
