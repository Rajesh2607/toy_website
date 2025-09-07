class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.originalPrice = data.originalPrice;
    this.discountPercentage = data.discountPercentage;
    this.image = data.image;
    this.images = data.images || [];
    this.category = data.category;
    this.categoryName = data.categoryName;
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
    this.description = data.description;
    this.inStock = data.inStock || true;
    this.stock = data.stock || 0;
    this.colors = data.colors || [];
    this.features = data.features || [];
    this.brand = data.brand;
    this.ageGroup = data.ageGroup;
    this.weight = data.weight;
    this.isActive = data.isActive || true;
    this.isFeatured = data.isFeatured || false;
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      originalPrice: this.originalPrice,
      discountPercentage: this.discountPercentage,
      image: this.image,
      images: this.images,
      category: this.category,
      categoryName: this.categoryName,
      rating: this.rating,
      reviewCount: this.reviewCount,
      description: this.description,
      inStock: this.inStock,
      stock: this.stock,
      colors: this.colors,
      features: this.features,
      brand: this.brand,
      ageGroup: this.ageGroup,
      weight: this.weight,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Product({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Product;
