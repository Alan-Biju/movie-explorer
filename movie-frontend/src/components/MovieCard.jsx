import { Link } from "react-router-dom";
import "./MovieCard.scss";

const FALLBACK_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <img
          src={movie.image || FALLBACK_IMAGE}
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-meta">
            {movie.year} • ⭐ {movie.rating}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
