const Category = require('../models/CategoryFirebase');
const { getFirestoreDB } = require('../config/firebase');
const { collection, getDocs, doc, getDoc, setDoc, deleteDoc } = require('firebase/firestore');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const categoriesRef = collection(db, 'categories');
    
    const querySnapshot = await getDocs(categoriesRef);
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      const category = Category.fromFirestore(doc);
      if (category.isActive) {
        categories.push(category);
      }
    });

    // Sort by sortOrder
    categories.sort((a, b) => a.sortOrder - b.sortOrder);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const categoryRef = doc(db, 'categories', req.params.id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = Category.fromFirestore(categoryDoc);

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category'
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const categoriesRef = collection(db, 'categories');
    
    const category = new Category(req.body);
    const newCategoryRef = doc(categoriesRef);
    category.id = newCategoryRef.id;
    
    await setDoc(newCategoryRef, category.toFirestore());

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const categoryRef = doc(db, 'categories', req.params.id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = Category.fromFirestore(categoryDoc);
    
    // Update category properties
    Object.keys(req.body).forEach(key => {
      if (key !== 'id') {
        category[key] = req.body[key];
      }
    });
    
    category.updatedAt = new Date();
    
    await setDoc(categoryRef, category.toFirestore());

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const db = getFirestoreDB();
    const categoryRef = doc(db, 'categories', req.params.id);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await deleteDoc(categoryRef);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
};
