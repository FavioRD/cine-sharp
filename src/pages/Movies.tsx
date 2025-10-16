import { Link } from "react-router-dom";

function Movies() {
  const peliculas = [
    { id: 1, titulo: "El Padrino", año: 1972, img:"https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008360.jpg" },
    { id: 2, titulo: "Pulp Fiction", año: 1994, img:"https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008360.jpg" },
    { id: 3, titulo: "El Caballero de la Noche", año: 2008, img:"https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008360.jpg" },
    { id: 4, titulo: "Forrest Gump", año: 1994, img:"https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008360.jpg" },
    { id: 5, titulo: "Inception", año: 2010, img:"https://sacnkprodpecms.blob.core.windows.net/content/posters/HO00008360.jpg" },
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
                borderRadius: "8px",
                transition: "transform 0.2s",
                cursor: "pointer",
                backgroundColor: "#23211E",                
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img src={pelicula.img} alt={pelicula.titulo} />
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
