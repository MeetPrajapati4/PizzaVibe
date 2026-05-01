import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getEnhancedStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/user', getMyOrders);
router.get('/admin', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getEnhancedStats);
router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
