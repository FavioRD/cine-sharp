import { useParams } from "react-router-dom";
import { useFetchMovieById } from ".././hooks/useFetchMovieById";

function MovieDetail() {
  const { id } = useParams();
  const movieId = Number(id);
  const { movie } = useFetchMovieById(movieId);

  if (!movie) return <p className="text-center text-gray-400 mt-10">Película no encontrada</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.imagen}
          alt={movie.titulo}
          className="w-full md:w-1/3 rounded-lg shadow-lg object-cover"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-3">{movie.titulo}</h1>
          <p className="mb-2 text-gray-300">Clasificación: {movie.clasificacion}</p>
          <p className="mb-2 text-gray-300">Duración: {movie.duracionMinutos} min</p>
          <p className="text-gray-400 mt-4">{movie.sinopsis}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
