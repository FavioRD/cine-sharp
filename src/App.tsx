import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";

function App() {
  return (
    <Routes>
      {/* Rutas públicas de autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Todas las rutas son públicas ahora */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="peliculas" element={<Movies />} />
        <Route path="peliculas/:id" element={<MovieDetail />} />
        <Route path="acerca" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
