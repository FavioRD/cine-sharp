import { useState } from 'react';

interface Movie {
  id: number;
  titulo: string;
  imagen: string;
  duracionMinutos: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  showtime: string;
  language: string;
  seatPrice: number;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
}

function PaymentModal({ isOpen, onClose, movie, showtime, language, seatPrice }: PaymentModalProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Generar asientos de ejemplo
  function generateSeats(): Seat[] {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seats: Seat[] = [];
    
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          isAvailable: Math.random() > 0.3, // 70% de probabilidad de estar disponible
          isSelected: false
        });
      }
    });
    
    return seats;
  }

  const toggleSeatSelection = (seatId: string) => {
    if (!isSeatAvailable(seatId)) return;

    setSeats(seats.map(seat => 
      seat.id === seatId 
        ? { ...seat, isSelected: !seat.isSelected }
        : seat
    ));
  };

  const isSeatAvailable = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    return seat?.isAvailable;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento de pago
    alert(`¡Pago exitoso! Se han comprado ${selectedSeats.length} entradas para ${movie.titulo}`);
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Comprar Entradas</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold">Película</p>
              <p>{movie.titulo}</p>
            </div>
            <div>
              <p className="font-semibold">Horario</p>
              <p>{showtime}</p>
            </div>
            <div>
              <p className="font-semibold">Idioma</p>
              <p>{language}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Paso 1: Selección de asientos */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Selecciona tus asientos</h3>
              
              {/* Leyenda */}
              <div className="flex gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>No disponible</span>
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
              <div className="bg-gray-800 text-white text-center py-2 mb-8 mx-auto max-w-md rounded">
                PANTALLA
              </div>

              {/* Asientos */}
              <div className="grid grid-cols-10 gap-2 mb-8 max-w-2xl mx-auto">
                {seats.map(seat => (
                  <button
                    key={seat.id}
                    onClick={() => toggleSeatSelection(seat.id)}
                    disabled={!seat.isAvailable}
                    className={`
                      w-8 h-8 rounded text-xs font-medium
                      ${!seat.isAvailable 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : seat.isSelected 
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              {/* Resumen */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Resumen de compra</h4>
                <p>Asientos seleccionados: {selectedSeats.map(s => s.id).join(', ') || 'Ninguno'}</p>
                <p>Cantidad: {selectedSeats.length}</p>
                <p className="text-lg font-bold mt-2">Total: S/ {totalAmount.toFixed(2)}</p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={nextStep}
                  disabled={selectedSeats.length === 0}
                  className="bg-red-800 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Continuar al pago
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
                    <label className="block text-sm font-medium mb-1">Nombre completo</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={customerInfo.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de expiración</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={customerInfo.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={customerInfo.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Resumen final */}
                <div className="bg-gray-100 p-4 rounded-lg mt-6">
                  <h4 className="font-bold mb-2">Resumen final</h4>
                  <div className="flex justify-between">
                    <span>{selectedSeats.length} entradas</span>
                    <span>S/ {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total a pagar:</span>
                    <span>S/ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    Confirmar pago
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;