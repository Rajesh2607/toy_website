class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.image = data.image;
    this.isActive = data.isActive || true;
    this.parentId = data.parentId || null;
    this.sortOrder = data.sortOrder || 0;
    this.productCount = data.productCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      image: this.image,
      isActive: this.isActive,
      parentId: this.parentId,
      sortOrder: this.sortOrder,
      productCount: this.productCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Category({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Category;
