import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({ email, contrasena: password });

    if (result && result.token) {
      // Login exitoso, verificar si hay una URL de retorno
      const returnUrl = localStorage.getItem("returnUrl");

      if (returnUrl) {
        localStorage.removeItem("returnUrl");
        navigate(returnUrl);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div
      className="relative bg-cover bg-center min-h-screen"
      style={{
        backgroundImage: `url(https://wallpapers.com/images/hd/poster-background-hlybuowt1whxbh2z.jpg)`,
      }}
    >
      {/* Capa de oscurecimiento */}
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen ">
        <div className="bg-white w-full max-w-md h-[60vh] p-12 rounded-lg shadow-lg flex flex-col justify-between">
          <h1 className="text-4xl text-center font-bold mb-6">Cine-Sharp</h1>
          <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contraseña"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-4 font-semibold">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-blue-600">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
