import express from 'express';
import {
  getPublicFeedback,
  getAllFeedback,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicFeedback); // Public approved feedback
router.post('/', createFeedback); // Public submission
router.get('/', protect, getAllFeedback); // Admin view all
router.put('/:id', protect, updateFeedbackStatus); // Admin approve/reject
router.delete('/:id', protect, deleteFeedback); // Admin delete

export default router;
