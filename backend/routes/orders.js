const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Placeholder routes - will be implemented as needed
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get orders endpoint' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create order endpoint' });
});

module.exports = router;
