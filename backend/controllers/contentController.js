import { ContentRepo } from '../data/repo.js';

export async function getContent(req, res, next) {
  try {
    const content = await ContentRepo.get();
    res.json(content);
  } catch (err) {
    next(err);
  }
}

export async function updateContent(req, res, next) {
  try {
    const updates = req.body;
    const updated = await ContentRepo.update(updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
