import { Router } from 'express';
import { FineController } from '../controllers/FineController';

const router = Router();

router.get('/', FineController.getAll);
router.post('/', FineController.create);
router.patch('/:id', FineController.update);

export default router;