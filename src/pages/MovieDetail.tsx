import { useParams } from "react-router-dom";
import { useFetchMovieById } from "../hooks/useFetchMovieById";
import { useFetchFunctions } from "../hooks/useFetchFunctions";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";

function MovieDetail() {
  const { id } = useParams();
  const movieId = Number(id);
  const { movie } = useFetchMovieById(movieId);
  const { functions, loading: loadingFunctions } = useFetchFunctions(movieId);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFuncion, setSelectedFuncion] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  if (!movie)
    return (
      <p className="text-center text-gray-400 mt-10">Película no encontrada</p>
    );

  const handleBuyTickets = () => {
    if (!selectedFuncion || !selectedLanguage) {
      alert("Por favor selecciona función e idioma");
      return;
    }
    setShowPaymentModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Para mostrar solo HH:MM
  };

  return (
    <>
      <div className="flex lg:flex-row w-full min-h-screen text-gray-900">
        <div className="w-full lg:w-2/4 p-10 flex flex-col mt-15 text-left rounded-br-3xl shadow-lg">
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
                Funciones disponibles:
              </label>
              {loadingFunctions ? (
                <p className="text-white">Cargando funciones...</p>
              ) : functions.length > 0 ? (
                <select
                  value={selectedFuncion || ""}
                  onChange={(e) => setSelectedFuncion(Number(e.target.value))}
                  className="w-full max-w-xs bg-white border border-red-400 rounded-lg p-2 text-gray-800"
                >
                  <option value="">Seleccionar función</option>
                  {functions.map((funcion) => (
                    <option key={funcion.id} value={funcion.id}>
                      {formatDate(funcion.fecha)} - {formatTime(funcion.horaInicio)} | {funcion.sala} | S/ {funcion.precio}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white">No hay funciones disponibles</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-lg mb-2">Idioma:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full max-w-xs bg-white border border-red-400 rounded-lg p-2 text-gray-800"
              >
                <option value="">Seleccionar idioma</option>
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
              disabled={!selectedFuncion || !selectedLanguage}
              className="mt-6 w-fit bg-red-800 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300"
            >
              Comprar Entradas
            </button>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {selectedFuncion && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          movie={movie}
          funcionId={selectedFuncion}
          seatPrice={functions.find(f => f.id === selectedFuncion)?.precio || 20}
        />
      )}
    </>
  );
}

export default MovieDetail;