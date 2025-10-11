function About() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>ℹ️ Acerca de CineSharp</h1>
      <p style={{ marginTop: "1rem", maxWidth: "600px" }}>
        CineSharp es una plataforma dedicada a los amantes del cine. Aquí podrás
        descubrir películas clásicas y modernas, leer reseñas y explorar el
        maravilloso mundo del séptimo arte.
      </p>
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          border: "1px solid #646cff",
          borderRadius: "8px",
          maxWidth: "600px",
        }}
      >
        <h3>Características:</h3>
        <ul>
          <li>Catálogo extenso de películas</li>
          <li>Información detallada de cada película</li>
          <li>Interfaz moderna y fácil de usar</li>
          <li>Navegación intuitiva</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
