import { useState } from "react";

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contrasena: string;
}

interface RespuestaRegisterDTO {
  mensaje: string;
  token?: string;
}

interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<RespuestaRegisterDTO | null>;
  loading: boolean;
  error: string | null;
  data: RespuestaRegisterDTO | null;
  clearError: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RespuestaRegisterDTO | null>(null);

  const url = import.meta.env.VITE_API_URL;

  const register = async (
    registerData: RegisterData
  ): Promise<RespuestaRegisterDTO | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}/auth/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar usuario");
      }

      const responseData = await response.json();
      setData(responseData);

      // Guardar el token si viene en la respuesta (auto-login después de registro)
      if (responseData.token) {
        localStorage.setItem("authToken", responseData.token);
      }

      return responseData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    loading,
    error,
    data,
    clearError,
  };
};
