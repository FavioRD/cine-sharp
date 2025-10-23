import { useState, useEffect } from 'react';

interface Seat {
  id: number;
  fila: string;
  numero: number;
  salaId: number;
  disponible: boolean;
  codigo: string;
}

interface SeatsResponse {
  sala: string;
  tipoSala: string;
  capacidad: number;
  asientos: Seat[];
  precio: number;
}

export const useFetchSeats = (funcionId: number) => {
  const [seats, setSeats] = useState<SeatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!funcionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://localhost:32773/api/Asientos/funcion/${funcionId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los asientos');
        }
        
        const data: SeatsResponse = await response.json();
        setSeats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [funcionId]);

  return { seats, loading, error };
};