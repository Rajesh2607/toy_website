const Cart = require('../models/CartFirebase');
const { getFirestoreDB } = require('../config/firebase');
const { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      // Create empty cart if doesn't exist
      const newCart = new Cart(req.user.id);
      await setDoc(cartRef, newCart.toFirestore());
      
      return res.json({
        success: true,
        cart: {
          items: [],
          total: 0,
          itemCount: 0
        }
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    
    console.log(`📦 Cart retrieved for user ${req.user.id}: ${cart.items.length} items, total: ${cart.calculateTotal()}`);
    
    res.json({
      success: true,
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
        itemCount: cart.getItemCount()
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, options = {} } = req.body;
    const { color = 'default', size = null } = options;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    const cartDoc = await getDoc(cartRef);

    let cart;
    if (!cartDoc.exists()) {
      // Create new cart
      cart = new Cart(req.user.id);
    } else {
      cart = Cart.fromFirestore(cartDoc);
    }

    // Get product details (you might want to fetch from products collection)
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = productDoc.data();
    
    // Add item to cart
    const cartItem = {
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: parseInt(quantity),
      color,
      size,
      addedAt: new Date()
    };

    cart.addItem(cartItem);

    // Save cart
    await setDoc(cartRef, cart.toFirestore());

    console.log(`✅ Item added to cart for user ${req.user.id}: ${product.name} x${quantity}`);

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
        itemCount: cart.getItemCount()
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, color = 'default', size = null } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID or quantity'
      });
    }

    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cart = Cart.fromFirestore(cartDoc);

    if (quantity === 0) {
      cart.removeItem(productId, color, size);
    } else {
      cart.updateQuantity(productId, quantity, color, size);
    }

    await setDoc(cartRef, cart.toFirestore());

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
        itemCount: cart.getItemCount()
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color = 'default', size = null } = req.query;

    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    const cartDoc = await getDoc(cartRef);

    if (!cartDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.removeItem(productId, color, size);

    await setDoc(cartRef, cart.toFirestore());

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
        itemCount: cart.getItemCount()
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    
    // Create empty cart
    const cart = new Cart(req.user.id);
    await setDoc(cartRef, cart.toFirestore());

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
};

// @desc    Sync guest cart with user cart OR save current cart
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = async (req, res) => {
  try {
    const { guestItems = [], cartItems = [], guestCartItems = [] } = req.body;
    
    // Determine which items to sync (support both formats)
    let itemsToSync = [];
    if (guestItems.length > 0) {
      itemsToSync = guestItems;
    } else if (guestCartItems.length > 0) {
      itemsToSync = guestCartItems;
    } else if (cartItems.length > 0) {
      itemsToSync = cartItems;
    }

    if (!Array.isArray(itemsToSync) || itemsToSync.length === 0) {
      return res.json({
        success: true,
        message: 'No items to sync',
        cart: { items: [], total: 0, itemCount: 0 }
      });
    }

    const db = getFirestoreDB();
    const cartRef = doc(db, 'carts', req.user.id);
    const cartDoc = await getDoc(cartRef);

    let cart;
    if (!cartDoc.exists()) {
      cart = new Cart(req.user.id);
    } else {
      cart = Cart.fromFirestore(cartDoc);
    }

    // Clear existing cart if saving current cart (not merging)
    if (cartItems.length > 0) {
      cart.items = [];
    }

    // Sync items
    let syncedCount = 0;
    for (const item of itemsToSync) {
      try {
        // Get product details if we only have productId
        let productDetails = item;
        if (item.productId && !item.name) {
          const productRef = doc(db, 'products', item.productId);
          const productDoc = await getDoc(productRef);
          
          if (productDoc.exists()) {
            const product = productDoc.data();
            productDetails = {
              ...item,
              name: product.name,
              price: product.price,
              image: product.image
            };
          } else {
            console.warn(`Product not found: ${item.productId}`);
            continue;
          }
        }

        const cartItem = {
          productId: productDetails.productId || productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          image: productDetails.image,
          quantity: productDetails.quantity || 1,
          color: productDetails.color || 'default',
          size: productDetails.size || null,
          addedAt: new Date()
        };

        cart.addItem(cartItem);
        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync item ${item.productId || item.id}:`, error);
      }
    }

    await setDoc(cartRef, cart.toFirestore());

    res.json({
      success: true,
      message: `${syncedCount} items synced successfully`,
      cart: {
        items: cart.items,
        total: cart.calculateTotal(),
        itemCount: cart.getItemCount()
      }
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart'
    });
  }
};
