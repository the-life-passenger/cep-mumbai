import express from 'express';
import {
  createSurvey,
  getSurveys,
  deleteSurvey,
  getSurveyStats
} from '../controllers/surveyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createSurvey); // Public survey submission
router.get('/stats', getSurveyStats); // Analytics for findings & admin
router.get('/', protect, getSurveys); // Admin view
router.delete('/:id', protect, deleteSurvey); // Admin delete

export default router;
