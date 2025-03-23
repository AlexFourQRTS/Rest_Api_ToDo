const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const authenticateToken = require('../../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;