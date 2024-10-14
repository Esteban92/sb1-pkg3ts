import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import SavedPaymentMethods from '../components/SavedPaymentMethods';
import axios from 'axios';

const stripePromise = loadStripe('tu_clave_publica_de_stripe');

const Payment: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/payment-methods');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Pago realizado con éxito');
    fetchPaymentMethods(); // Actualizar la lista de métodos de pago
  };

  const handlePaymentMethodSelect = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handlePaymentMethodDelete = async (paymentMethodId) => {
    try {
      await axios.delete(`http://localhost:5000/api/payments/payment-methods/${paymentMethodId}`);
      fetchPaymentMethods(); // Actualizar la lista de métodos de pago
    } catch (error) {
      console.error('Error al eliminar método de pago:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Pagos</h1>
      
      <SavedPaymentMethods
        paymentMethods={paymentMethods}
        onSelect={handlePaymentMethodSelect}
        onDelete={handlePaymentMethodDelete}
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Agregar Nuevo Método de Pago</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm onSuccess={handlePaymentSuccess} />
      </Elements>
    </div>
  );
};

export default Payment;