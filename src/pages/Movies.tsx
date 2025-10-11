import { Link } from "react-router-dom";

function Movies() {
  const peliculas = [
    { id: 1, titulo: "El Padrino", año: 1972 },
    { id: 2, titulo: "Pulp Fiction", año: 1994 },
    { id: 3, titulo: "El Caballero de la Noche", año: 2008 },
    { id: 4, titulo: "Forrest Gump", año: 1994 },
    { id: 5, titulo: "Inception", año: 2010 },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎥 Películas</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {peliculas.map((pelicula) => (
          <Link
            key={pelicula.id}
            to={`/peliculas/${pelicula.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                border: "1px solid #646cff",
                padding: "1.5rem",
                borderRadius: "8px",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h3>{pelicula.titulo}</h3>
              <p>Año: {pelicula.año}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Movies;
