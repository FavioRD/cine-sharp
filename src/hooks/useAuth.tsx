import { useState } from "react";

interface LoginCredentials {
  email: string;
  contrasena: string;
}

interface RespuestaAuthDTO {
  token?: string;
  mensaje: string;
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<RespuestaAuthDTO | null>;
  loading: boolean;
  error: string | null;
  data: RespuestaAuthDTO | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RespuestaAuthDTO | null>(null);

  const url = import.meta.env.VITE_API_URL;
  const login = async (
    credentials: LoginCredentials
  ): Promise<RespuestaAuthDTO | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const responseData = await response.json();
      setData(responseData);

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
    login,
    loading,
    error,
    data,
    clearError,
  };
};
