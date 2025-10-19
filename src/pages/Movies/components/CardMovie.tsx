import { MovieCard } from "../../../components/MovieCard";
import { useFetchMovies } from "../../../hooks/useFetchMovies";

export const CardMovie = () => {
  const { movies } = useFetchMovies();
  return (
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie}/>
        ))}
      </div>
  );
};
