import { Router } from 'express';
import { getRooms, getRoomById, createRoom, deleteRoom, updateRoom } from '../controllers/RoomController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', authMiddleware, adminMiddleware, createRoom);
router.put('/:id', authMiddleware, adminMiddleware, updateRoom);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRoom);

export default router;
