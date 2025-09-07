const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart
} = require('../controllers/cartController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Cart routes
router.route('/')
  .get(getCart);

router.route('/add')
  .post(addToCart);

router.route('/update')
  .put(updateCartItem);

router.route('/remove/:productId')
  .delete(removeFromCart);

router.route('/clear')
  .delete(clearCart);

router.route('/sync')
  .post(syncCart);

module.exports = router;
