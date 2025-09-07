const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Placeholder routes - will be implemented as needed
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get wishlist endpoint' });
});

router.post('/add', (req, res) => {
  res.json({ success: true, message: 'Add to wishlist endpoint' });
});

module.exports = router;
