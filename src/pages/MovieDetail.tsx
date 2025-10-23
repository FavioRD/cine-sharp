import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFetchMovieById } from ".././hooks/useFetchMovieById";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";

function MovieDetail() {
  const { id } = useParams();
  const movieId = Number(id);
  const { movie } = useFetchMovieById(movieId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBuyTickets = () => {
    const isAuthenticated = !!localStorage.getItem("authToken");

    if (!isAuthenticated) {
      // Guardar la URL actual para volver después del login
      localStorage.setItem("returnUrl", location.pathname);
      navigate("/login");
    } else {
      setShowPaymentModal(true);
    }
  };

  if (!movie)
    return (
      <p className="text-center text-gray-400 mt-10">Película no encontrada</p>
    );

  return (
    <>
      <div className="flex lg:flex-row w-full min-h-screen  text-gray-900">
        <div className="w-full lg:w-2/4p-10 flex flex-col mt-15 text-left rounded-br-3xl shadow-lg">
          <h1 className="font-extrabold text-5xl mb-6 text-white drop-shadow-lg">
            {movie.titulo}
          </h1>

          <img
            className="w-120 h-auto rounded-2xl shadow-2xl mb-6 hover:scale-102 transition-transform duration-500"
            src={movie.imagen}
            alt={`Poster ${movie.titulo}`}
          />

          <div className="backdrop-blur-sm rounded-xl text-left w-full max-w-xl shadow-md">
            <p className="text-lg mb-4 text-white">
              <span className="font-semibold text-white">Clasificación:</span>{" "}
              {movie.clasificacion}
            </p>

            <p className="text-base text-white/90 mb-6 italic">
              {movie.sinopsis}
            </p>

            <hr className="border-white/40 my-4" />
            <p className="text-lg text-white">
              <strong>Duración:</strong> {movie.duracionMinutos} minutos
            </p>

            <hr className="border-white/40 my-4" />
            <p className="text-lg text-white">
              <strong>Idioma:</strong> {movie.idioma}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col mt-15 text-left rounded-br-3xl shadow-lg">
          <h1 className="font-extrabold text-5xl text-white mb-8">Horarios</h1>
          <div className="space-y-6 text-white">
            <div>
              <label className="block font-semibold text-lg mb-2">
                Funciones:
              </label>
              <select
                name="funciones"
                className="w-full max-w-xs bg-white border border-red-400 rounded-lg p-2 text-gray-800"
              >
                <option value="funcion1">Función 1</option>
                <option value="funcion2">Función 2</option>
                <option value="funcion3">Función 3</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-lg mb-2">
                Idioma:
              </label>
              <select
                name="idioma"
                className="w-full max-w-xs bg-white border border-red-400 rounded-lg p-2 text-gray-800"
              >
                <option value="español">Español</option>
                <option value="inglés">Inglés</option>
                <option value="subtitulada">Subtitulada</option>
              </select>
            </div>

            <div>
              <p className="font-semibold text-lg">Dirección:</p>
              <p className="font-semibold text-lg">Av. micasita</p>
            </div>

            <button
              onClick={handleBuyTickets}
              className="mt-6 w-fit bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300"
            >
              Comprar Entradas
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        movie={movie}
        showtime="16:00 - Función 1"
        language="Español"
        seatPrice={20}
      />
    </>
  );
}

export default MovieDetail;
