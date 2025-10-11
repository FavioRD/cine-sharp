export interface MovieDTO {
  id: number;
  titulo: string;
  imagen: string;
  clasificacion: string;
  duracionMinutos: number;
}

export interface MovieFuncion {
  fecha: string;
  hora: string;
  precio: number;
  sala: string;
}

export interface DetalleMovieDTO extends MovieDTO {
  sinopsis: string;
  funciones: MovieFuncion[];
}
