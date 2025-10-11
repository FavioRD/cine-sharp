import { useState, useEffect } from "react";
import type { MovieDTO } from "../dtos/MovieDTO";

export const useFetchMovies = () => {
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await fetch(`${url}/peliculas/obtener-todas`);
      const data = await response.json();
      setMovies(data);
    };
    fetchMovies();
  }, [url]);

  return { movies };
};
