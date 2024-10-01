import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path as necessary

// User Registration
export const registerUser = async (req, res) => {
  const { name, username, password, role, email, mobile } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role,
      email,
      mobile,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users for filtering in the dropdown
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name _id'); // Fetch only name and _id fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get complete user information
export const getCompleteUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch user by ID from token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      mobile: user.mobile, // Add any other fields as necessary
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user information' });
  }
};
