import { Router } from 'express';
import {
    getResponders,
    getResponderById,
    getAvailableResponders,
    createResponder,
    updateResponder,
    updateResponderStatus
} from '../controllers/responderController';

const router = Router();

router.get('/', getResponders);
router.get('/available', getAvailableResponders);
router.get('/:id', getResponderById);
router.post('/', createResponder);
router.put('/:id', updateResponder);
router.patch('/:id/status', updateResponderStatus);

export default router; 