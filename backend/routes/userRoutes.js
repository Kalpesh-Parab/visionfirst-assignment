import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCompleteUserInfo,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Example of a protected route (for admins only)
router.get('/admin', authenticate, authorize(['IT_ADMIN']), (req, res) => {
  res.send('Welcome Admin');
});

// Route to get all users
router.get('/all', getAllUsers);

// Route to get complete user information
router.get('/me', authenticate, getCompleteUserInfo);

export default router;
