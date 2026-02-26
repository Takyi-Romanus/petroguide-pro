const express = require('express');
const router = express.Router();
const Module = require('../models/module');
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/learn.html'));
});

module.exports = router;
