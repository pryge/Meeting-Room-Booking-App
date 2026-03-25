import { Router } from 'express';
import { getRooms, createRoom, deleteRoom } from '../controllers/RoomController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getRooms);
router.post('/', authMiddleware, createRoom);
router.delete('/:id', authMiddleware, deleteRoom);

export default router;
