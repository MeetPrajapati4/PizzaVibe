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
import './models/index.js'; // Ensure models are registered

const app = express();


// Security
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Routes
const router = express.Router();
router.use('/auth', authRoutes);
router.use('/pizzas', pizzaRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/dominos', dominosRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api', router);
app.use('/_/backend/api', router);

// Global error handler
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5001;

// Initialize database connection
connectDB().catch(err => {
  console.error('❌ Failed to connect to database during startup:', err.message);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🍕 PizzaVibe API running on port ${PORT}`);
  });
}

export default app;
