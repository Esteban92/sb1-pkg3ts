import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';

interface PaymentMethod {
  _id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

interface SavedPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onSelect: (paymentMethod: PaymentMethod) => void;
  onDelete: (paymentMethodId: string) => void;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({ paymentMethods, onSelect, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Métodos de Pago Guardados</h2>
      {paymentMethods.length === 0 ? (
        <p>No tienes métodos de pago guardados.</p>
      ) : (
        <ul className="space-y-4">
          {paymentMethods.map((method) => (
            <li key={method._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <div className="flex items-center">
                <CreditCard className="mr-4" />
                <div>
                  <p className="font-semibold">{method.brand} **** **** **** {method.last4}</p>
                  <p className="text-sm text-gray-600">Expira: {method.expMonth}/{method.expYear}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => onSelect(method)}
                  className="mr-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  Usar
                </button>
                <button
                  onClick={() => onDelete(method._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPaymentMethods;