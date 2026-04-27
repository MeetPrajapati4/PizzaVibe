import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/coupon', applyCoupon);

export default router;
