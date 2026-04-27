import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate JWT token with role embedded for frontend routing decisions.
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

const buildUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isAdmin: user.role === 'admin'
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Block registration with the reserved admin username
    if (email === 'Admin@Boss') {
      return res.status(403).json({ message: 'This username is reserved' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    return res.status(201).json({ token, user: buildUserPayload(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email (works for Admin@Boss as well as regular emails)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({ token, user: buildUserPayload(user) });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  return res.json({ user: buildUserPayload(req.user) });
};
