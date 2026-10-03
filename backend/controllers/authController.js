import bcrypt from 'bcryptjs';
import { UsersRepo } from '../data/repo.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await UsersRepo.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await UsersRepo.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await UsersRepo.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (user._id) {
      user.password = hashedPassword;
      await user.save();
    } else {
      // JSON store update
      const { usersStore } = await import('../data/store.js');
      await usersStore.findByIdAndUpdate(user.id, { password: hashedPassword });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}
