import { apiService } from './api.js';

// Cart service
class CartService {
  constructor() {
    this.cartItems = this.getStoredCart();
  }

  // Get current user ID for localStorage keys
  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user._id;
      }
    } catch (error) {
      console.error('Error getting current user ID:', error);
    }
    return null;
  }

  // Get user-specific cart key
  getCartKey() {
    const userId = this.getCurrentUserId();
    return userId ? `cartItems_${userId}` : 'cartItems_guest';
  }

  // Get stored cart from localStorage (user-specific)
  getStoredCart() {
    try {
      const cartKey = this.getCartKey();
      const cartData = localStorage.getItem(cartKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error parsing stored cart data:', error);
      return [];
    }
  }

  // Store cart data (user-specific)
  storeCart(items) {
    this.cartItems = items;
    const cartKey = this.getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, options = {}) {
    try {
      // Check if user is authenticated for persistent cart
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.post('/cart/add', {
          productId,
          quantity,
          options,
        });
        if (response.success) {
          // Backend returns cart.items, not cartItems
          const cartItems = response.cart?.items || response.cartItems || [];
          this.storeCart(cartItems);
          return { 
            success: true, 
            cartItems: cartItems,
            message: response.message 
          };
        } else {
          return { 
            success: false, 
            message: response.message || 'Failed to add to cart' 
          };
        }
      } else {
        // Handle guest cart
        const existingItemIndex = this.cartItems.findIndex(
          item => item.productId === productId && 
          JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (existingItemIndex >= 0) {
          this.cartItems[existingItemIndex].quantity += quantity;
        } else {
          this.cartItems.push({
            productId,
            quantity,
            options,
            addedAt: new Date().toISOString(),
          });
        }

        this.storeCart(this.cartItems);
        return { 
          success: true, 
          cartItems: this.cartItems,
          message: 'Item added to cart successfully'
        };
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      return { success: false, message: error.message || 'Failed to add to cart' };
    }
  }

  // Update cart item quantity
  async updateQuantity(itemId, quantity) {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.put(`/cart/update/${itemId}`, { quantity });
        if (response.success) {
          this.storeCart(response.cartItems);
          return { success: true, cartItems: response.cartItems };
        }
      } else {
        // Handle guest cart
        const itemIndex = this.cartItems.findIndex(item => item.productId === itemId);
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            this.cartItems.splice(itemIndex, 1);
          } else {
            this.cartItems[itemIndex].quantity = quantity;
          }
          this.storeCart(this.cartItems);
          return { success: true, cartItems: this.cartItems };
        }
      }
      return { success: false, message: 'Item not found' };
    } catch (error) {
      console.error('Update quantity error:', error);
      return { success: false, message: error.message || 'Failed to update quantity' };
    }
  }

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.delete(`/cart/remove/${itemId}`);
        if (response.success) {
          this.storeCart(response.cartItems);
          return { success: true, cartItems: response.cartItems };
        }
      } else {
        // Handle guest cart
        this.cartItems = this.cartItems.filter(item => item.productId !== itemId);
        this.storeCart(this.cartItems);
        return { success: true, cartItems: this.cartItems };
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, message: error.message || 'Failed to remove from cart' };
    }
  }

  // Get cart items
  // Get cart with total calculation
  async getCart() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.get('/cart');
        if (response.success) {
          // Backend returns cart.items, not cartItems
          const cartItems = response.cart?.items || response.cartItems || [];
          this.storeCart(cartItems);
          const total = response.cart?.total || this.calculateTotal(cartItems);
          return { 
            success: true, 
            items: cartItems, 
            total: total 
          };
        }
      }
      
      // For guest users, use local storage
      const items = this.getStoredCart();
      const total = this.calculateTotal(items);
      return { 
        success: true, 
        items: items, 
        total: total 
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      const items = this.getStoredCart();
      const total = this.calculateTotal(items);
      return { 
        success: true, 
        items: items, 
        total: total 
      };
    }
  }

  // Get cart items (existing method)
  async getCartItems() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.get('/cart');
        if (response.success) {
          this.storeCart(response.cartItems);
          return { success: true, cartItems: response.cartItems };
        }
      }
      return { success: true, cartItems: this.cartItems };
    } catch (error) {
      console.error('Get cart items error:', error);
      return { success: true, cartItems: this.cartItems }; // Fallback to local cart
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await apiService.delete('/cart/clear');
      }
      this.cartItems = [];
      const cartKey = this.getCartKey();
      localStorage.removeItem(cartKey);
      return { success: true, cartItems: [] };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false, message: error.message || 'Failed to clear cart' };
    }
  }

  // Clear cart count
  getCartCount() {
    return this.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  // Clear user-specific cart data (called on logout)
  clearUserCart() {
    const cartKey = this.getCartKey();
    localStorage.removeItem(cartKey);
    this.cartItems = [];
    console.log(`🧹 [DEBUG] Cleared user-specific cart data: ${cartKey}`);
  }

  // Save current cart state to database before logout
  async saveCartBeforeLogout() {
    try {
      const token = localStorage.getItem('authToken');
      if (token && this.cartItems.length > 0) {
        console.log('💾 [DEBUG] Saving cart to database before logout:', this.cartItems);
        
        // Convert cart items to the format expected by backend
        const formattedItems = this.cartItems.map(item => ({
          productId: item.id || item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
          color: item.color || 'default',
          size: item.size || null
        }));

        const response = await apiService.post('/cart/sync', {
          cartItems: formattedItems,
        });
        
        if (response.success) {
          console.log('✅ [DEBUG] Cart successfully saved to database');
          return { success: true, message: 'Cart saved successfully' };
        } else {
          console.error('❌ [DEBUG] Failed to save cart:', response.message);
          return { success: false, message: response.message };
        }
      }
      return { success: true, message: 'No cart data to save' };
    } catch (error) {
      console.error('❌ [DEBUG] Save cart error:', error);
      return { success: false, message: error.message || 'Failed to save cart' };
    }
  }

  // Sync guest cart with user cart after login
  async syncGuestCart(userToken) {
    try {
      if (this.cartItems.length > 0) {
        const response = await apiService.post('/cart/sync', {
          guestCartItems: this.cartItems,
        });
        if (response.success) {
          this.storeCart(response.cartItems);
          return { success: true, cartItems: response.cartItems };
        }
      }
      return { success: true, cartItems: this.cartItems };
    } catch (error) {
      console.error('Sync cart error:', error);
      return { success: false, message: error.message || 'Failed to sync cart' };
    }
  }

  // Calculate total price of cart items
  calculateTotal(items = []) {
    return items.reduce((total, item) => {
      const price = item.price || item.product?.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }
}

export const cartService = new CartService();
export default cartService;
