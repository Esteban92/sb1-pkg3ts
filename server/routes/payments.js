import express from 'express';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import PaymentMethod from '../models/PaymentMethod.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ... (código existente)

// Agregar un método de pago
router.post('/add-payment-method', auth, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // Obtener o crear un cliente de Stripe para el usuario
    let customer;
    if (!req.user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: req.user.email,
      });
      // Actualizar el usuario con el ID de cliente de Stripe
      req.user.stripeCustomerId = customer.id;
      await req.user.save();
    } else {
      customer = await stripe.customers.retrieve(req.user.stripeCustomerId);
    }

    // Adjuntar el método de pago al cliente
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Establecer como método de pago predeterminado
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Obtener detalles del método de pago
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Guardar el método de pago en nuestra base de datos
    const newPaymentMethod = new PaymentMethod({
      user: req.user._id,
      stripeCustomerId: customer.id,
      last4: paymentMethod.card.last4,
      brand: paymentMethod.card.brand,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
      isDefault: true
    });

    await newPaymentMethod.save();

    res.status(201).json({ message: 'Método de pago agregado con éxito', paymentMethod: newPaymentMethod });
  } catch (error) {
    console.error('Error al agregar método de pago:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Obtener métodos de pago del usuario
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ user: req.user._id });
    res.json(paymentMethods);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Eliminar un método de pago
router.delete('/payment-methods/:id', auth, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, user: req.user._id });
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }

    // Eliminar el método de pago en Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripeCustomerId);

    // Eliminar el método de pago de nuestra base de datos
    await PaymentMethod.deleteOne({ _id: req.params.id });

    res.json({ message: 'Método de pago eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

export default router;