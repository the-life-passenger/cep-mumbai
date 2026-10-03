import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin protected routes
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
