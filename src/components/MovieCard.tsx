import { Link } from "react-router-dom";
import type { MovieDTO } from "../dtos/MovieDTO";

export const MovieCard = (movie: MovieDTO) => {
  return (
    <div className="bg-gray-600 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
      {/* Imagen de la película */}
      <div className="relative w-full overflow-hidden aspect-[2/3]">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          src={movie.imagen}
          alt={movie.titulo}
        />
      </div>

      {/* Contenido de la card */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">
          {movie.titulo}
        </h3>

        <div className="flex items-center gap-3 mb-4 text-sm text-white">
          <span className="py-1  rounded font-semibold">
            {movie.clasificacion}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {movie.duracionMinutos} min
          </span>
        </div>

        {/* Botón Ver más */}
        <Link
          to={`/peliculas/${movie.id}`}
          className="mt-auto inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          Ver más
        </Link>
      </div>
    </div>
  );
};
