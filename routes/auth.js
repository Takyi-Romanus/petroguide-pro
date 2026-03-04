const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { redirectIfAuth } = require('../middleware/auth');
const path = require('path');

// GET /auth/login
router.get('/login', redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// GET /auth/register
router.get('/register', redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ fullName, email, password, role: role || 'student' });
    
    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    console.log(`User registered successfully: ${email}`);
    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error('Registration error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.warn(`Failed login attempt for user: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    
    console.log(`User logged in: ${email}`);
    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, redirect: '/' });
});

module.exports = router;
