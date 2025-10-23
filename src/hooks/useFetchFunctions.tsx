import { useState, useEffect } from 'react';

interface Function {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  precio: number;
  sala: string;
  tipoSala: string;
  pelicula: string;
}

export const useFetchFunctions = (peliculaId: number) => {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunctions = async () => {
      if (!peliculaId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://localhost:32773/api/Funciones/pelicula/${peliculaId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar las funciones');
        }
        
        const data: Function[] = await response.json();
        setFunctions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, [peliculaId]);

  return { functions, loading, error };
};