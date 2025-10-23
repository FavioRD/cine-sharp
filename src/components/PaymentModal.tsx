import { useState, useEffect } from 'react';
import { useFetchSeats } from '../hooks/useFetchSeats';

interface Movie {
  id: number;
  titulo: string;
  imagen: string;
  duracionMinutos: number;
  clasificacion: string;
  sinopsis: string;
  idioma: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  funcionId: number;
  seatPrice: number;
}

interface Seat {
  id: number;
  fila: string;
  numero: number;
  salaId: number;
  disponible: boolean;
  codigo: string;
  isSelected: boolean;
}

function PaymentModal({ isOpen, onClose, movie, funcionId, seatPrice }: PaymentModalProps) {
  const { seats: seatsData, loading, error } = useFetchSeats(funcionId);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Actualizar asientos cuando lleguen los datos de la API
  useEffect(() => {
    if (seatsData?.asientos) {
      const mappedSeats = seatsData.asientos.map(seat => ({
        ...seat,
        isSelected: false
      }));
      setSeats(mappedSeats);
    }
  }, [seatsData]);

  const toggleSeatSelection = (seatId: number) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || !seat.disponible) return;

    setSeats(seats.map(seat => 
      seat.id === seatId 
        ? { ...seat, isSelected: !seat.isSelected }
        : seat
    ));
  };

  const selectedSeats = seats.filter(seat => seat.isSelected);
  const totalAmount = selectedSeats.length * seatPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Preparar datos para el pago
      const paymentData = {
        funcionId: funcionId,
        asientosIds: selectedSeats.map(seat => seat.id),
        usuarioInfo: customerInfo,
        total: totalAmount,
        pelicula: movie.titulo,
        asientos: selectedSeats.map(seat => seat.codigo)
      };

      console.log('Datos de pago:', paymentData);

      // Simular pago exitoso
      alert(`¡Pago exitoso! Se han comprado ${selectedSeats.length} entradas para ${movie.titulo}\nAsientos: ${selectedSeats.map(s => s.codigo).join(', ')}\nTotal: S/ ${totalAmount.toFixed(2)}`);
      
      onClose();
    } catch (error) {
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedSeats.length === 0) {
      alert('Por favor selecciona al menos un asiento');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  // Agrupar asientos por fila para mejor visualización
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.fila]) {
      acc[seat.fila] = [];
    }
    acc[seat.fila].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Comprar Entradas - {movie.titulo}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          {seatsData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold">Sala</p>
                <p>{seatsData.sala} ({seatsData.tipoSala})</p>
              </div>
              <div>
                <p className="font-semibold">Precio por asiento</p>
                <p>S/ {seatPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="font-semibold">Capacidad</p>
                <p>{seatsData.capacidad} asientos</p>
              </div>
              <div>
                <p className="font-semibold">Disponibles</p>
                <p>{seats.filter(s => s.disponible).length} asientos</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <p>Cargando asientos...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Paso 1: Selección de asientos */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Selecciona tus asientos</h3>
                  
                  {/* Leyenda */}
                  <div className="flex gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span>Ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Seleccionado</span>
                    </div>
                  </div>

                  {/* Pantalla */}
                  <div className="bg-gray-800 text-white text-center py-3 mb-8 mx-auto max-w-2xl rounded-lg shadow-lg">
                    🎬 PANTALLA - {seatsData?.sala} 🎬
                  </div>

                  {/* Asientos organizados por filas */}
                  <div className="max-w-2xl mx-auto mb-8">
                    {Object.entries(seatsByRow).map(([fila, asientosFila]) => (
                      <div key={fila} className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-6 text-center font-bold">{fila}</div>
                        <div className="flex gap-2">
                          {asientosFila.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeatSelection(seat.id)}
                              disabled={!seat.disponible}
                              className={`
                                w-8 h-8 rounded text-xs font-medium transition-all
                                ${!seat.disponible 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : seat.isSelected 
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }
                              `}
                              title={`Asiento ${seat.codigo}`}
                            >
                              {seat.numero}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Resumen de compra</h4>
                    <p>Asientos seleccionados: {selectedSeats.map(s => s.codigo).join(', ') || 'Ninguno'}</p>
                    <p>Cantidad: {selectedSeats.length}</p>
                    <p className="text-lg font-bold mt-2">Total: S/ {totalAmount.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={nextStep}
                      disabled={selectedSeats.length === 0}
                      className="bg-red-800 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                    >
                      Continuar al pago ({selectedSeats.length})
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Información de pago */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Información de pago</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                        <input
                          type="text"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Teléfono *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Número de tarjeta *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={customerInfo.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha de expiración *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={customerInfo.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={customerInfo.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="w-full border border-gray-300 rounded-lg p-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    {/* Resumen final */}
                    <div className="bg-gray-100 p-4 rounded-lg mt-6">
                      <h4 className="font-bold mb-2">Resumen final</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Película:</span>
                          <span>{movie.titulo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Asientos:</span>
                          <span>{selectedSeats.map(s => s.codigo).join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cantidad:</span>
                          <span>{selectedSeats.length} entradas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Precio unitario:</span>
                          <span>S/ {seatPrice.toFixed(2)}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total a pagar:</span>
                          <span>S/ {totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                      >
                        ← Volver
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                      >
                        Confirmar pago ✓
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;