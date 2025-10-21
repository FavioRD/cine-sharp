import { useState, useEffect } from "react";
import type { DetalleMovieDTO } from "../dtos/MovieDTO";
import { useNavigate } from "react-router-dom";

export const useFetchMovieById = (id: number) => {
  const [movie, setMovie] = useState<DetalleMovieDTO>();
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(`${url}/peliculas/detalle/${id}`);
      const data = await response.json();

      if (response.status === 200) {
        setMovie(data);
      } else {
        navigate("/404");
      }
    };
    fetchMovie();
  }, [id, url, navigate]);

  return { movie };
};
