class Cart {
  constructor(userId = null, data = {}) {
    this.userId = userId;
    this.items = data.items || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      userId: this.userId,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Cart(data.userId, {
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    });
  }

  // Add item to cart
  addItem(item) {
    const existingItemIndex = this.items.findIndex(cartItem => 
      cartItem.productId === item.productId && 
      cartItem.color === item.color && 
      cartItem.size === item.size
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      this.items[existingItemIndex].quantity += item.quantity;
      this.items[existingItemIndex].updatedAt = new Date();
    } else {
      // Add new item
      this.items.push({
        ...item,
        addedAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    this.updatedAt = new Date();
  }

  // Remove item from cart
  removeItem(productId, color = 'default', size = null) {
    this.items = this.items.filter(item => 
      !(item.productId === productId && 
        item.color === color && 
        item.size === size)
    );
    this.updatedAt = new Date();
  }

  // Update item quantity
  updateQuantity(productId, quantity, color = 'default', size = null) {
    const itemIndex = this.items.findIndex(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeItem(productId, color, size);
      } else {
        this.items[itemIndex].quantity = quantity;
        this.items[itemIndex].updatedAt = new Date();
        this.updatedAt = new Date();
      }
    }
  }

  // Calculate total price
  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Get total item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clear() {
    this.items = [];
    this.updatedAt = new Date();
  }

  // Check if cart is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get item by product details
  getItem(productId, color = 'default', size = null) {
    return this.items.find(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );
  }

  // Validate cart items
  validateItems() {
    return this.items.filter(item => 
      item.productId && 
      item.quantity > 0 && 
      item.price >= 0
    );
  }
}

module.exports = Cart;
