import { useState, useEffect } from "react";
import type { DetalleMovieDTO } from "../dtos/MovieDTO";

export const useFetchMovieById = (id: number) => {
    const [movie, setMovie] = useState<DetalleMovieDTO>();
    const url = import.meta.env.VITE_API_URL;
    useEffect(() => {
    const fetchMovie = async () => {
        const response = await fetch(`${url}/peliculas/detalle/${id}`);
        const data = await response.json();
        setMovie(data);
    };
    fetchMovie();
    }, [id, url]);

    return { movie };
};
