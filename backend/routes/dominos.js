import { Router } from 'express';
import { 
    findNearbyStores, 
    getStoreMenu,
    validateAndPrice, 
    placeOrder, 
    trackOrderByPhone 
} from '../controllers/dominosController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/stores', findNearbyStores);
router.get('/menu/:storeId', getStoreMenu);
router.post('/validate', protect, validateAndPrice);
router.post('/place', protect, placeOrder);
router.get('/track/:phone', trackOrderByPhone);

export default router;
