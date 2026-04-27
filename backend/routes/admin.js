import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getAllUsers,
  toggleUserRole,
  deleteUser,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getEnhancedStats
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getEnhancedStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', toggleUserRole);
router.delete('/users/:id', deleteUser);

// Coupon management
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

export default router;
