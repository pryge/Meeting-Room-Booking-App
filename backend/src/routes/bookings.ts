import { Router } from 'express';
import { getBookings, createBooking, cancelBooking, updateBooking } from '../controllers/BookingController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, createBooking);
router.put('/:id', authMiddleware, adminMiddleware, updateBooking);
router.delete('/:id', authMiddleware, cancelBooking);

export default router;
