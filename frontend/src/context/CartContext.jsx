import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        loading: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'ADD_ITEM_OPTIMISTIC': {
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id && 
        item.color === action.payload.color &&
        item.size === action.payload.size
      );
      
      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'REMOVE_ITEM_OPTIMISTIC':
      const filteredItems = state.items.filter(item => 
        !(item.id === action.payload.id && 
          item.color === action.payload.color &&
          item.size === action.payload.size)
      );
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };
    
    case 'UPDATE_QUANTITY_OPTIMISTIC': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id && 
        item.color === action.payload.color &&
        item.size === action.payload.size
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

// Calculate total helper function
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    loading: true
  });

  // Load cart on component mount and periodically sync
  useEffect(() => {
    loadCart();
    
    // Periodic sync every 5 minutes (not 30 seconds!)
    const syncInterval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (token && !state.loading) {
        loadCart();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(syncInterval);
  }, []);

  // Listen for logout events to save cart and clear UI
  useEffect(() => {
    const handleLogout = async () => {
      console.log('🔓 [DEBUG] Logout event received, saving cart before clearing UI');
      
      // First save the cart to database
      await saveCartBeforeLogout();
      
      // Then clear from UI
      clearCartLocal();
    };

    window.addEventListener('auth-logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, []);

  const loadCart = async () => {
    console.log(`📥 [DEBUG] Loading cart from server... Time:`, new Date().toISOString());
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartData = await cartService.getCart();
      console.log(`📥 [DEBUG] Cart data received:`, cartData);
      
      if (cartData.success) {
        dispatch({
          type: 'SET_CART',
          payload: {
            items: cartData.items || [],
            total: cartData.total || 0
          }
        });
        console.log(`✅ [DEBUG] Cart loaded successfully:`, cartData.items?.length, 'items');
      } else {
        console.error(`❌ [DEBUG] Failed to load cart:`, cartData.message);
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Cart loading exception:`, error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product, quantity = 1, color = 'default', size = null) => {
    console.log(`🛒 [DEBUG] Adding to cart: ${product.name} x${quantity}`, { product, color, size });
    
    // Optimistic update
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      color,
      size,
      productId: product.id,
      timestamp: Date.now() // Add timestamp for debugging
    };

    dispatch({ type: 'ADD_ITEM_OPTIMISTIC', payload: cartItem });
    console.log(`🛒 [DEBUG] Optimistic update applied`, { cartItem });

    try {
      const result = await cartService.addToCart(product.id, quantity, { color, size });
      console.log(`🛒 [DEBUG] Cart service response:`, result);
      
      if (result.success) {
        // Keep optimistic update and sync cart data if needed
        if (result.cartItems) {
          console.log(`🛒 [DEBUG] Updating cart with server data:`, result.cartItems);
          dispatch({
            type: 'SET_CART',
            payload: {
              items: result.cartItems,
              total: calculateTotal(result.cartItems)
            }
          });
        }
        console.log(`✅ [DEBUG] Cart operation successful`);
        return { success: true, message: result.message || 'Item added to cart successfully!' };
      } else {
        console.error(`❌ [DEBUG] Cart service failed:`, result.message);
        // Revert optimistic update on failure
        dispatch({ type: 'REMOVE_ITEM', payload: { id: product.id, color, size } });
        return { success: false, message: result.message || 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error(`❌ [DEBUG] Cart service exception:`, error);
      // Revert optimistic update on error
      dispatch({ type: 'REMOVE_ITEM', payload: { id: product.id, color, size } });
      return { success: false, message: 'Failed to add item to cart' };
    }
  };

  const removeFromCart = async (productId, color = 'default', size = null) => {
    // Optimistic update
    dispatch({ 
      type: 'REMOVE_ITEM_OPTIMISTIC', 
      payload: { id: productId, color, size } 
    });

    try {
      const result = await cartService.removeFromCart(productId, color, size);
      if (result.success) {
        await loadCart();
        return { success: true, message: result.message };
      } else {
        await loadCart();
        return { success: false, message: result.message };
      }
    } catch (error) {
      await loadCart();
      console.error('Remove from cart error:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  };

  const updateQuantity = async (productId, quantity, color = 'default', size = null) => {
    // Optimistic update
    dispatch({ 
      type: 'UPDATE_QUANTITY_OPTIMISTIC', 
      payload: { id: productId, quantity, color, size } 
    });

    try {
      const result = await cartService.updateCartItem(productId, quantity, color, size);
      if (result.success) {
        await loadCart();
        return { success: true, message: result.message };
      } else {
        await loadCart();
        return { success: false, message: result.message };
      }
    } catch (error) {
      await loadCart();
      console.error('Update quantity error:', error);
      return { success: false, message: 'Failed to update cart' };
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    try {
      const result = await cartService.clearCart();
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        await loadCart();
        return { success: false, message: result.message };
      }
    } catch (error) {
      await loadCart();
      console.error('Clear cart error:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  };

  const clearCartLocal = () => {
    console.log('🧹 [DEBUG] Clearing cart locally');
    dispatch({ type: 'CLEAR_CART' });
  };

  const saveCartBeforeLogout = async () => {
    try {
      console.log('💾 [DEBUG] Saving cart before logout');
      const result = await cartService.saveCartBeforeLogout();
      if (result.success) {
        console.log('✅ [DEBUG] Cart saved successfully before logout');
      } else {
        console.error('❌ [DEBUG] Failed to save cart before logout:', result.message);
      }
      return result;
    } catch (error) {
      console.error('❌ [DEBUG] Save cart before logout error:', error);
      return { success: false, message: error.message };
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.total;
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      total: state.total,
      loading: state.loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearCartLocal,
      saveCartBeforeLogout,
      getTotalItems,
      getTotalPrice,
      refreshCart: loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
