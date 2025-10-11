import { MovieCard } from "../../../components/MovieCard";
import { useFetchMovies } from "../../../hooks/useFetchMovies";

export const Movies = () => {
  const { movies } = useFetchMovies();
  return (
    <main>
      <h1 className="text-4xl text-center font-bold text-white my-20">
        Películas de Cine-Sharp
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </main>
  );
};
