import { Outlet, Link } from "react-router-dom";

function Layout() {
  // const location = useLocation();

  // const navLinkStyle = (path: string) => ({
  //   padding: "0.5rem 1rem",
  //   textDecoration: "none",
  //   color: location.pathname === path ? "#646cff" : "inherit",
  //   fontWeight: location.pathname === path ? "bold" : "normal",
  //   borderBottom: location.pathname === path ? "2px solid #646cff" : "none",
  // });

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
      </nav>
      <main>
        <Outlet />
      </main>
      {<footer>
        <div className="text-center p-4 text-white">
          &copy; {new Date().getFullYear()} Cine-Sharp. Todos los derechos reservados.
        </div>
      </footer>}
    </div>
  );
}

export default Layout;
