import { Outlet, Link, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="container mx-auto ">
      <nav className="flex justify-between items-center p-4  mt-4">
        <h2 className="text-4xl font-bold text-white">Cine-Sharp</h2>
        <div className="flex gap-4">
          <Link
            to="/"
            className="text-white hover:text-blue-700 font-black text-xl"
          >
            Inicio
          </Link>
          <Link
            to="/peliculas"
            className="text-white hover:text-blue-700 font-black text-xl"
          >
            Películas
          </Link>
          <Link
            to="/acerca"
            className="text-white hover:text-blue-700 font-black text-xl"
          >
            Acerca de
          </Link>
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-700 p-2 px-6 rounded-md hover:text-red-400 hover:bg-red-800 transition-all duration-300 font-black text-xl"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-black bg-white py-2 font-black px-4 rounded-md text-xl"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="text-white bg-red-700 p-2 px-6 rounded-md hover:text-red-400 hover:bg-red-800 transition-all duration-300 font-black text-xl"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      {
        <footer>
          <div className="text-center p-4 text-white">
            &copy; {new Date().getFullYear()} Cine-Sharp. Todos los derechos
            reservados.
          </div>
        </footer>
      }
    </div>
  );
}

export default Layout;
