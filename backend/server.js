import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import pizzaRoutes from './routes/pizzas.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import dominosRoutes from './routes/dominos.js';
import adminRoutes from './routes/admin.js';

const app = express();


// Security
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dominos', dominosRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Global error handler
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🍕 PizzaVibe API running on port ${PORT}`);
  });
});
