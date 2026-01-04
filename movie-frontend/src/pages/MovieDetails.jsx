import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../api/api";
import MainLayout from "../layouts/MainLayout";
import "../styles/MovieDetails.scss";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <MainLayout hideSearch>
      <div className="movie-details-container">
        <Link to="/" className="back-link">← Back</Link>

        {loading && <p className="loading">Loading movie details...</p>}

        {!loading && !movie && (
          <div className="not-found-state">
            <img
              src="https://via.placeholder.com/300x200?text=Movie+Not+Found"
              alt="Movie not found"
            />
            <h2>Movie not found</h2>
            <p>The movie you are looking for does not exist.</p>

            <button onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        )}

        {!loading && movie && (
          <div className="movie-details-card">
            <img
              src={movie.image}
              alt={movie.title}
              className="movie-details-poster"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />

            <div className="movie-details-info">
              <h1>{movie.title}</h1>

              <p className="meta">
                {movie.year} • ⭐ {movie.rating}
              </p>

              <p>
                <strong>Director:</strong>{" "}
                {movie.director?.name || "N/A"}
              </p>

              <p>
                <strong>Actors:</strong>{" "}
                {(movie.actors || []).map(a => a.name).join(", ") || "N/A"}
              </p>

              <p>
                <strong>Genres:</strong>{" "}
                {(movie.genres || []).map(g => g.name).join(", ") || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MovieDetails;
