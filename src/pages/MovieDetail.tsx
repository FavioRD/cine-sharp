import { useParams, useNavigate } from "react-router-dom";

function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const peliculasData: Record<
    string,
    { titulo: string; año: number; director: string; descripcion: string }
  > = {
    "1": {
      titulo: "El Padrino",
      año: 1972,
      director: "Francis Ford Coppola",
      descripcion:
        "La historia del patriarca de una dinastía del crimen organizado.",
    },
    "2": {
      titulo: "Pulp Fiction",
      año: 1994,
      director: "Quentin Tarantino",
      descripcion: "Historias entrelazadas de crimen en Los Ángeles.",
    },
    "3": {
      titulo: "El Caballero de la Noche",
      año: 2008,
      director: "Christopher Nolan",
      descripcion: "Batman enfrenta al Joker en Gotham City.",
    },
    "4": {
      titulo: "Forrest Gump",
      año: 1994,
      director: "Robert Zemeckis",
      descripcion: "La vida extraordinaria de un hombre simple.",
    },
    "5": {
      titulo: "Inception",
      año: 2010,
      director: "Christopher Nolan",
      descripcion:
        "Un ladrón entra en los sueños de otros para robar secretos.",
    },
  };

  const pelicula = id ? peliculasData[id] : null;

  if (!pelicula) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>❌ Película no encontrada</h1>
        <button
          onClick={() => navigate("/peliculas")}
          style={{
            padding: "10px 20px",
            background: "#646cff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Volver a Películas
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          background: "#646cff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        ← Volver
      </button>
      <h1>🎬 {pelicula.titulo}</h1>
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.5rem",
          border: "1px solid #646cff",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Director:</strong> {pelicula.director}
        </p>
        <p>
          <strong>Año:</strong> {pelicula.año}
        </p>
        <p>
          <strong>Descripción:</strong> {pelicula.descripcion}
        </p>
      </div>
    </div>
  );
}

export default MovieDetail;
