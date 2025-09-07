const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.phone = data.phone || '';
    this.isEmailVerified = data.isEmailVerified || false;
    this.addresses = data.addresses || [];
    this.wishlist = data.wishlist || [];
    this.compareList = data.compareList || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Hash password before saving
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.role,
      phone: this.phone,
      isEmailVerified: this.isEmailVerified,
      addresses: this.addresses,
      wishlist: this.wishlist,
      compareList: this.compareList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      id: doc.id,
      ...data
    });
  }
}

module.exports = User;
