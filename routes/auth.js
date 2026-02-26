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
    const { fullName, email, password, role } = req.body;
    
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

    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, redirect: '/' });
});

module.exports = router;
