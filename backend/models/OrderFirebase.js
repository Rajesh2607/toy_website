class Order {
  constructor(data) {
    this.id = data.id;
    this.orderNumber = data.orderNumber || this.generateOrderNumber();
    this.user = data.user;
    this.items = data.items || [];
    this.shippingAddress = data.shippingAddress;
    this.subtotal = data.subtotal || 0;
    this.shippingCost = data.shippingCost || 0;
    this.tax = data.tax || 0;
    this.discount = data.discount || 0;
    this.total = data.total || 0;
    this.paymentMethod = data.paymentMethod; // 'cod', 'razorpay', 'wallet'
    this.paymentStatus = data.paymentStatus || 'pending'; // 'pending', 'paid', 'failed', 'refunded'
    this.paymentId = data.paymentId;
    this.orderStatus = data.orderStatus || 'processing'; // 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'
    this.notes = data.notes;
    this.trackingNumber = data.trackingNumber;
    this.estimatedDelivery = data.estimatedDelivery;
    this.deliveredAt = data.deliveredAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      user: this.user,
      items: this.items,
      shippingAddress: this.shippingAddress,
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      tax: this.tax,
      discount: this.discount,
      total: this.total,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      paymentId: this.paymentId,
      orderStatus: this.orderStatus,
      notes: this.notes,
      trackingNumber: this.trackingNumber,
      estimatedDelivery: this.estimatedDelivery,
      deliveredAt: this.deliveredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Order({
      id: doc.id,
      ...data
    });
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TOY${timestamp}${random}`;
  }

  // Calculate order totals
  calculateTotals() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax (18% GST)
    this.tax = Math.round(this.subtotal * 0.18);
    
    // Calculate shipping cost
    if (this.subtotal < 500) {
      this.shippingCost = 50;
    } else {
      this.shippingCost = 0;
    }
    
    // Calculate final total
    this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
    
    this.updatedAt = new Date();
    return this.total;
  }

  // Update order status
  updateStatus(status, notes = null) {
    this.orderStatus = status;
    if (notes) {
      this.notes = notes;
    }
    
    if (status === 'delivered') {
      this.deliveredAt = new Date();
    }
    
    this.updatedAt = new Date();
  }

  // Update payment status
  updatePaymentStatus(status, paymentId = null) {
    this.paymentStatus = status;
    if (paymentId) {
      this.paymentId = paymentId;
    }
    this.updatedAt = new Date();
  }

  // Add tracking information
  addTracking(trackingNumber, estimatedDelivery = null) {
    this.trackingNumber = trackingNumber;
    if (estimatedDelivery) {
      this.estimatedDelivery = estimatedDelivery;
    }
    this.updatedAt = new Date();
  }
}

module.exports = Order;
