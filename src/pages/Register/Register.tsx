import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import { useState } from "react";

export const Register = () => {
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud de contraseña
    if (formData.contrasena.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const result = await register(formData);

    if (result) {
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8">
        <div className="bg-white w-full max-w-2xl p-12 rounded-lg shadow-lg">
          <h1 className="text-4xl text-center font-bold mb-6">Cine-Sharp</h1>
          <h2 className="text-2xl font-semibold mb-6">Crear cuenta</h2>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Apellido"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="999 999 999"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Confirmar contraseña"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white p-3 rounded-md hover:bg-red-800 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors font-bold"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 font-semibold">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
