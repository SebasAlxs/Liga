import { Router } from 'express';
import { FineTypeController } from '../controllers/FineTypeController';

const router = Router();

router.get('/', FineTypeController.getAll);
router.post('/', FineTypeController.create);
router.put('/:id', FineTypeController.update);
router.delete('/:id', FineTypeController.delete);

export default router;