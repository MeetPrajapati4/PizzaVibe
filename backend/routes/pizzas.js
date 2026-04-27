import { Router } from 'express';
import { getAllPizzas, getPizzaById, createPizza, updatePizza, deletePizza, addReview } from '../controllers/pizzaController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);
router.post('/', protect, adminOnly, createPizza);
router.put('/:id', protect, adminOnly, updatePizza);
router.delete('/:id', protect, adminOnly, deletePizza);
router.post('/:id/reviews', protect, addReview);

export default router;
