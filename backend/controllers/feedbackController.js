import { FeedbackRepo } from '../data/repo.js';

export async function getPublicFeedback(req, res, next) {
  try {
    const feedbackList = await FeedbackRepo.getAll(true); // only approved
    res.json(feedbackList);
  } catch (err) {
    next(err);
  }
}

export async function getAllFeedback(req, res, next) {
  try {
    const feedbackList = await FeedbackRepo.getAll(false); // all feedback
    res.json(feedbackList);
  } catch (err) {
    next(err);
  }
}

export async function createFeedback(req, res, next) {
  try {
    const { name, rating, feedback, suggestion } = req.body;

    if (!rating || !feedback) {
      return res.status(400).json({ message: 'Rating (1-5) and feedback text are required' });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const newFeedback = await FeedbackRepo.create({
      name: name ? name.trim() : 'Community Resident',
      rating: ratingNum,
      feedback: feedback.trim(),
      suggestion: suggestion ? suggestion.trim() : '',
      approved: false // Moderation required
    });

    res.status(201).json({
      message: 'Feedback submitted successfully. It will appear publicly once approved by the project team.',
      data: newFeedback
    });
  } catch (err) {
    next(err);
  }
}

export async function updateFeedbackStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const existing = await FeedbackRepo.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const updated = await FeedbackRepo.update(id, {
      approved: Boolean(approved)
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteFeedback(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await FeedbackRepo.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully', id });
  } catch (err) {
    next(err);
  }
}
