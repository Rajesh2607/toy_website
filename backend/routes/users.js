const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Placeholder routes - will be implemented as needed
router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile endpoint' });
});

router.put('/addresses', (req, res) => {
  res.json({ success: true, message: 'Update addresses endpoint' });
});

module.exports = router;
