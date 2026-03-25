import { Router } from 'express';
import { getBookings, createBooking, cancelBooking } from '../controllers/BookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/room/:roomId', authMiddleware, getBookings);
router.post('/', authMiddleware, createBooking);
router.delete('/:id', authMiddleware, cancelBooking);

export default router;
