import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMovies } from "../api/api";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hooks/useDebounce";
import MainLayout from "../layouts/MainLayout";
import "../styles/MoviesList.scss";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 2;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("name") || "";
  const actorId = searchParams.get("actor_id");
  const genreId = searchParams.get("genre_id");
  const director_id = searchParams.get("director_id");


  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadMovies(1, true);
  }, [debouncedSearch, searchParams]);

  const loadMovies = async (pageNumber, reset = false) => {
    try {
      setLoading(true);
      setError("");

      const res = await getMovies({
        page: pageNumber,
        limit,
        title: debouncedSearch || undefined,
        actor_id: actorId || undefined,
        genre_id: genreId || undefined,
        director_id: director_id || undefined,
      });

      const newMovies = res.data.data || [];

      setMovies((prev) =>
        reset ? newMovies : [...prev, ...newMovies]
      );

      setTotal(res.data.total || 0);
      setPage(pageNumber);
    } catch (err) {
      setError("Failed to load movies. Please try again");
      setMovies([])
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = movies.length < total;

  return (
    <MainLayout>
      <div className="movie-list-container">

        {!loading && error && (
          <div className="error-state">
            <img
              src="https://cdn.dribbble.com/userupload/21741357/file/original-9d8b3de9f8d3bd091ac2dc9ab085c467.jpg?format=webp&resize=400x300&vertical=center"
              alt="Error"
            />
            <p>{error}</p>
            <button onClick={() => loadMovies(1, true)}>Retry</button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="empty-state">
            <p>No movies found</p>
          </div>
        )}

        {!error && movies.length > 0 && (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {hasMore && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={() => loadMovies(page + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading.." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default MoviesList;
