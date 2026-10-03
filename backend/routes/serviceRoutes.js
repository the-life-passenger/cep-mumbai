import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getLocalities,
  getServiceStats
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/localities', getLocalities);
router.get('/stats', getServiceStats);
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin protected routes
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
