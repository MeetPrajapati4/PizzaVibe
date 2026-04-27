import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/user', getUserOrders);
router.get('/admin', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getAdminStats);
router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
