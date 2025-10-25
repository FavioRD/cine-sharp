import { useState, useEffect } from "react";
import { useFetchSeats } from "../hooks/useFetchSeats";

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

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  metodoPago?: string;
}

function PaymentModal({
  isOpen,
  onClose,
  movie,
  funcionId,
  seatPrice,
}: PaymentModalProps) {
  const { seats: seatsData, loading, error } = useFetchSeats(funcionId);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    metodoPago: "",
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetModalState();
    }
  }, [isOpen, funcionId]);

  useEffect(() => {
    if (seatsData?.asientos && isOpen) {
      const mappedSeats = seatsData.asientos.map((seat) => ({
        ...seat,
        isSelected: false,
      }));
      setSeats(mappedSeats);
    }
  }, [seatsData, isOpen]);

  const resetModalState = () => {
    setSeats([]);
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      metodoPago: "",
    });
    setValidationErrors({});
    setCurrentStep(1);
    setIsSubmitting(false);
    setShowDatePicker(false);
  };

  // Función para cerrar el modal y resetear
  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const toggleSeatSelection = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat || !seat.disponible) return;

    setSeats(
      seats.map((seat) =>
        seat.id === seatId ? { ...seat, isSelected: !seat.isSelected } : seat
      )
    );
  };

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const totalAmount = selectedSeats.length * seatPrice;

  // Funciones de validación
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return /^[0-9]{12,19}$/.test(cleaned);
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;

    const [month, year] = expiryDate.split("/");
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    return true;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^[0-9]{3}$/.test(cvv);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  };

  const showNumberOnlyAlert = (fieldName: string) => {
    alert(`Por favor, ingresa solo números en el campo ${fieldName}`);
  };

  const validateStep2 = (): boolean => {
    const errors: ValidationErrors = {};

    // Validar método de pago
    if (!customerInfo.metodoPago) {
      errors.metodoPago = "Selecciona un método de pago";
    }

    // Validar nombre
    if (!customerInfo.name.trim()) {
      errors.name = "El nombre es requerido";
    } else if (!validateName(customerInfo.name)) {
      errors.name = "El nombre debe tener entre 2 y 50 caracteres";
    }

    // Validar email
    if (!customerInfo.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!validateEmail(customerInfo.email)) {
      errors.email = "Ingresa un email válido";
    }

    // Validar teléfono
    if (!customerInfo.phone.trim()) {
      errors.phone = "El teléfono es requerido";
    } else if (!validatePhone(customerInfo.phone)) {
      errors.phone = "El teléfono debe tener exactamente 9 dígitos";
    }

    // Validar número de tarjeta (solo si método es Tarjeta)
    if (customerInfo.metodoPago === "Tarjeta") {
      if (!customerInfo.cardNumber.trim()) {
        errors.cardNumber = "El número de tarjeta es requerido";
      } else if (!validateCardNumber(customerInfo.cardNumber)) {
        errors.cardNumber =
          "Ingresa un número de tarjeta válido (12-19 dígitos)";
      }

      if (!customerInfo.expiryDate.trim()) {
        errors.expiryDate = "La fecha de expiración es requerida";
      } else if (!validateExpiryDate(customerInfo.expiryDate)) {
        errors.expiryDate =
          "Ingresa una fecha válida (MM/AA) y que no esté vencida";
      }

      if (!customerInfo.cvv.trim()) {
        errors.cvv = "El CVV es requerido";
      } else if (!validateCVV(customerInfo.cvv)) {
        errors.cvv = "El CVV debe tener exactamente 3 dígitos";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Formateo en tiempo real
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.slice(0, 19);
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
      if (value.length > 3 && /\D/.test(value)) {
        showNumberOnlyAlert("CVV");
      }
    } else if (name === "phone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 9);
      if (value.length > 9 && /\D/.test(value)) {
        showNumberOnlyAlert("teléfono");
      }
    }

    setCustomerInfo((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleDateSelect = (months: number) => {
    const now = new Date();
    const futureDate = new Date(now.getFullYear(), now.getMonth() + months, 1);

    const month = (futureDate.getMonth() + 1).toString().padStart(2, "0");
    const year = futureDate.getFullYear().toString().slice(-2);

    const formattedDate = `${month}/${year}`;

    setCustomerInfo((prev) => ({
      ...prev,
      expiryDate: formattedDate,
    }));

    setShowDatePicker(false);

    if (validationErrors.expiryDate) {
      setValidationErrors((prev) => ({
        ...prev,
        expiryDate: undefined,
      }));
    }
  };

  const generateDateOptions = () => {
    const options = [];
    const now = new Date();

    for (let i = 1; i <= 60; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const month = (futureDate.getMonth() + 1).toString().padStart(2, "0");
      const year = futureDate.getFullYear().toString().slice(-2);
      const monthName = futureDate.toLocaleString("es-ES", { month: "long" });

      options.push({
        value: i,
        label: `${monthName} ${futureDate.getFullYear()} (${month}/${year})`,
        months: i,
      });
    }

    return options;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateStep2()) {
        setIsSubmitting(false);
        return;
      }

      const paymentData = {
        funcionId: funcionId,
        asientosIds: selectedSeats.map((seat) => seat.id),
        total: totalAmount,
        metodoPago: customerInfo.metodoPago,
        usuarioInfo: {
          nombre: customerInfo.name.trim(),
          email: customerInfo.email.trim(),
          telefono: customerInfo.phone,
        },
        ...(customerInfo.metodoPago === "Tarjeta" && {
          tarjetaInfo: {
            numero: customerInfo.cardNumber.replace(/\s/g, ""),
            fechaExpiracion: customerInfo.expiryDate,
            cvv: customerInfo.cvv,
          },
        }),
      };

      console.log("Enviando pago:", paymentData);

      const response = await fetch(
        "https://localhost:32775/api/Pagos/procesar-pago",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          selectedSeats.some((selected) => selected.id === seat.id)
            ? { ...seat, disponible: false, isSelected: false } 
            : seat
        )
      );

      alert(`¡Pago exitoso! 
Código de transacción: ${result.codigoTransaccion}
Asientos: ${selectedSeats.map((s) => s.codigo).join(", ")}
Total: S/ ${totalAmount.toFixed(2)}`);

      
      handleClose();
    } catch (error) {
      console.error("Error en pago:", error);
      alert(
        `Error al procesar el pago: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedSeats.length === 0) {
      alert("Por favor selecciona al menos un asiento");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setValidationErrors({});
  };

  // Determinar si mostrar campos de tarjeta
  const showCardFields = customerInfo.metodoPago === "Tarjeta";

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
            <h2 className="text-2xl font-bold">
              Comprar Entradas - {movie.titulo}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          {seatsData && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold">Sala</p>
                <p>
                  {seatsData.sala} ({seatsData.tipoSala})
                </p>
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
                <p>{seats.filter((s) => s.disponible).length} asientos</p>
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
                  <h3 className="text-xl font-bold mb-4">
                    Selecciona tus asientos
                  </h3>

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
                      <div
                        key={fila}
                        className="flex items-center justify-center gap-2 mb-3"
                      >
                        <div className="w-6 text-center font-bold">{fila}</div>
                        <div className="flex gap-2">
                          {asientosFila.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeatSelection(seat.id)}
                              disabled={!seat.disponible}
                              className={`
                                w-8 h-8 rounded text-xs font-medium transition-all
                                ${
                                  !seat.disponible
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : seat.isSelected
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-green-500 hover:bg-green-600 text-white"
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
                    <p>
                      Asientos seleccionados:{" "}
                      {selectedSeats.map((s) => s.codigo).join(", ") ||
                        "Ninguno"}
                    </p>
                    <p>Cantidad: {selectedSeats.length}</p>
                    <p className="text-lg font-bold mt-2">
                      Total: S/ {totalAmount.toFixed(2)}
                    </p>
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
                  <h3 className="text-xl font-bold mb-4">
                    Información de pago
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Método de pago */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Método de pago *
                      </label>
                      <select
                        name="metodoPago"
                        value={customerInfo.metodoPago}
                        onChange={handleInputChange}
                        required
                        className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                          validationErrors.metodoPago
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Seleccionar método</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Yape">Yape</option>
                        <option value="Plin">Plin</option>
                        <option value="Efectivo">Efectivo</option>
                      </select>
                      {validationErrors.metodoPago && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.metodoPago}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          required
                          className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                            validationErrors.name
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Juan Pérez"
                        />
                        {validationErrors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                            validationErrors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="juan@ejemplo.com"
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                            validationErrors.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="987654321"
                          maxLength={9}
                          pattern="[0-9]{9}"
                          title="Ingresa exactamente 9 dígitos numéricos"
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.phone}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Solo números, 9 dígitos
                        </p>
                      </div>

                      {/* Campos condicionales para tarjeta */}
                      {showCardFields && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Número de tarjeta *
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={customerInfo.cardNumber}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                                validationErrors.cardNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              maxLength={19}
                              title="Ingresa entre 12 y 19 dígitos"
                            />
                            {validationErrors.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {validationErrors.cardNumber}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              12-19 dígitos
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                              <label className="block text-sm font-medium mb-1">
                                Fecha expiración *
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={customerInfo.expiryDate}
                                  onChange={handleInputChange}
                                  placeholder="MM/AA"
                                  className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                                    validationErrors.expiryDate
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                  maxLength={5}
                                  readOnly
                                  onClick={() =>
                                    setShowDatePicker(!showDatePicker)
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowDatePicker(!showDatePicker)
                                  }
                                  className="bg-gray-200 hover:bg-gray-300 px-3 rounded-lg border"
                                  title="Seleccionar fecha"
                                >
                                  📅
                                </button>
                              </div>

                              {showDatePicker && (
                                <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">
                                      Seleccionar fecha
                                    </h4>
                                    <button
                                      type="button"
                                      onClick={() => setShowDatePicker(false)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                  <div className="max-h-48 overflow-y-auto">
                                    {generateDateOptions().map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                          handleDateSelect(option.months)
                                        }
                                        className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {validationErrors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">
                                  {validationErrors.expiryDate}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                CVV *
                              </label>
                              <input
                                type="text"
                                name="cvv"
                                value={customerInfo.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className={`w-full border rounded-lg p-2 focus:ring-1 focus:ring-red-500 ${
                                  validationErrors.cvv
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                maxLength={3}
                                pattern="[0-9]{3}"
                                title="Ingresa exactamente 3 dígitos"
                              />
                              {validationErrors.cvv && (
                                <p className="text-red-500 text-sm mt-1">
                                  {validationErrors.cvv}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                3 dígitos
                              </p>
                            </div>
                          </div>
                        </>
                      )}
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
                          <span>
                            {selectedSeats.map((s) => s.codigo).join(", ")}
                          </span>
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
                        disabled={isSubmitting}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
                      >
                        ← Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-green-400"
                      >
                        {isSubmitting ? "Procesando..." : "Confirmar pago ✓"}
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
