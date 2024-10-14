import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import limiter from './middleware/rateLimiter.js';
import routesRouter from './routes/routes.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import messagesRouter from './routes/messages.js';
import reviewsRouter from './routes/reviews.js';
import paymentsRouter from './routes/payments.js';
import notificationsRouter from './routes/notifications.js';
import jwt from 'jsonwebtoken';
import Notification from './models/Notification.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Configurar el middleware para parsear JSON, excepto para la ruta del webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/routes', routesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationsRouter);

// Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    socket.decoded = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Función para crear y enviar notificaciones
const createNotification = async (recipientId, type, content, relatedItem = null, itemModel = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedItem,
      itemModel
    });
    await notification.save();
    io.to(recipientId.toString()).emit('newNotification', notification);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Make io and createNotification accessible to our router
app.set('io', io);
app.set('createNotification', createNotification);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});