const Product = require('../models/ProductFirebase');
const { getFirestoreDB } = require('../config/firebase');
const { collection, getDocs, doc, getDoc, setDoc, deleteDoc } = require('firebase/firestore');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productsRef = collection(db, 'products');
    
    // Get all products
    const querySnapshot = await getDocs(productsRef);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      const product = Product.fromFirestore(doc);
      if (product.isActive) {
        products.push(product);
      }
    });

    // Apply filters in JavaScript
    let filteredProducts = products;

    // Search functionality
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.categoryName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === req.query.category
      );
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        if (req.query.minPrice && product.price < Number(req.query.minPrice)) return false;
        if (req.query.maxPrice && product.price > Number(req.query.maxPrice)) return false;
        return true;
      });
    }

    // Filter by rating
    if (req.query.minRating) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= Number(req.query.minRating)
      );
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',')[0];
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      const field = sortBy.replace('-', '');
      
      filteredProducts.sort((a, b) => {
        if (a[field] < b[field]) return -1 * sortOrder;
        if (a[field] > b[field]) return 1 * sortOrder;
        return 0;
      });
    } else {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const pageLimit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = page * pageLimit;
    const total = filteredProducts.length;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: pageLimit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: pageLimit
      };
    }

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total,
      pagination,
      products: paginatedProducts
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productRef = doc(db, 'products', req.params.id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = Product.fromFirestore(productDoc);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productsRef = collection(db, 'products');
    
    const querySnapshot = await getDocs(productsRef);
    const featuredProducts = [];
    
    querySnapshot.forEach((doc) => {
      const product = Product.fromFirestore(doc);
      if (product.isFeatured && product.isActive) {
        featuredProducts.push(product);
      }
    });

    res.status(200).json({
      success: true,
      count: featuredProducts.length,
      data: featuredProducts
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productsRef = collection(db, 'products');
    
    const querySnapshot = await getDocs(productsRef);
    const categoryProducts = [];
    
    querySnapshot.forEach((doc) => {
      const product = Product.fromFirestore(doc);
      if (product.category === req.params.category && product.isActive) {
        categoryProducts.push(product);
      }
    });

    res.status(200).json({
      success: true,
      count: categoryProducts.length,
      data: categoryProducts
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productsRef = collection(db, 'products');
    
    const product = new Product(req.body);
    const newProductRef = doc(productsRef);
    product.id = newProductRef.id;
    
    await setDoc(newProductRef, product.toFirestore());

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productRef = doc(db, 'products', req.params.id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = Product.fromFirestore(productDoc);
    
    // Update product properties
    Object.keys(req.body).forEach(key => {
      if (key !== 'id') {
        product[key] = req.body[key];
      }
    });
    
    product.updatedAt = new Date();
    
    await setDoc(productRef, product.toFirestore());

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const productRef = doc(db, 'products', req.params.id);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await deleteDoc(productRef);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};
