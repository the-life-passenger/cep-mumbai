import jwt from 'jsonwebtoken';
import { UsersRepo } from '../data/repo.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mylocal_secret_cep_jwt_key_2026';

export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UsersRepo.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User associated with token not found' });
      }

      req.user = user;
      return next();
    } catch (err) {
      console.error('Auth verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
  }
}

export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
}
