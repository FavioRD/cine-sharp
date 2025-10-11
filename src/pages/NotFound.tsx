import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <h2>😕 Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link
        to="/"
        style={{
          marginTop: "2rem",
          padding: "10px 20px",
          background: "#646cff",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Volver al Inicio
      </Link>
    </div>
  );
}

export default NotFound;
