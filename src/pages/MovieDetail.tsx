import { useFetchMovies } from "../hooks/useFetchMovies";
function MovieDetail() {
  const { movies} = useFetchMovies();

  return (
    <div>
      {movies.map((movie) => (
        <div key={movie.id}>
          <h1>{movie.titulo}</h1>
          <p>{movie.clasificacion}</p>
        </div>
      ))}
    </div>
  );
}

export default MovieDetail;
