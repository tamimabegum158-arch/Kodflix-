import { useState, useEffect } from 'react';
import { getBackdropUrl, getMovieVideos, getMovieWatchLink } from '../api/tmdb';
import './MovieDetail.css';

const YOUTUBE_EMBED = (key) => `https://www.youtube.com/embed/${key}?autoplay=1`;
const YOUTUBE_WATCH = (key) => `https://www.youtube.com/watch?v=${key}`;

export default function MovieDetail({ movie, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);

  useEffect(() => {
    if (!movie?.id) return;
    setLoadingTrailer(true);
    getMovieVideos(movie.id)
      .then((key) => setTrailerKey(key))
      .catch(() => setTrailerKey(null))
      .finally(() => setLoadingTrailer(false));
  }, [movie?.id]);

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const embedUrl = trailerKey ? YOUTUBE_EMBED(trailerKey) : null;

  return (
    <div className="movie-detail-overlay" onClick={onClose} role="presentation">
      <div className="movie-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="movie-detail-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        {loadingTrailer ? (
          <div
            className="movie-detail-backdrop movie-detail-backdrop-placeholder"
            style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
          >
            <span className="movie-detail-play-loading">Loading…</span>
          </div>
        ) : embedUrl ? (
          <>
            <p className="movie-detail-trailer-label">Trailer (short clip — full movie not available here)</p>
            <div className="movie-detail-video-wrap">
              <iframe
                className="movie-detail-video"
                src={embedUrl}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </>
        ) : (
          <div
            className="movie-detail-backdrop"
            style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
          />
        )}
        <div className="movie-detail-content">
          <h2 className="movie-detail-title">{movie.title}</h2>
          {movie.release_date && (
            <p className="movie-detail-meta">{movie.release_date.slice(0, 4)}</p>
          )}
          <p className="movie-detail-overview">{movie.overview}</p>
          <p className="movie-detail-full-movie-note">
            Full movies are not streamed on Kodflix. To watch the full film, check streaming services.
          </p>
          {trailerKey && (
            <a
              href={YOUTUBE_WATCH(trailerKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="movie-detail-watch-link"
            >
              Open trailer on YouTube →
            </a>
          )}
          <a
            href={getMovieWatchLink(movie.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="movie-detail-watch-link"
          >
            Where to watch full movie (TMDB) →
          </a>
          {!trailerKey && !loadingTrailer && (
            <p className="movie-detail-no-trailer">No trailer available for this movie.</p>
          )}
        </div>
      </div>
    </div>
  );
}
