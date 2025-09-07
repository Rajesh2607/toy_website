const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import Firebase configuration
const { initializeFirebase } = require('./config/firebase');

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    /\.vercel\.app$/,
    /\.onrender\.com$/
  ].filter(Boolean),
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
const initDB = async () => {
  try {
    console.log('🔥 Initializing Firebase...');
    initializeFirebase();
    console.log('✅ Firebase initialized successfully!');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: '🚀 E-commerce API is running with Firebase!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'Firebase Firestore',
    project: 'toyshop-3779d'
  });
});

// Root route with API documentation
app.get('/', (req, res) => {
  res.json({
    message: '🎯 ToyLand E-commerce API with Firebase',
    version: '1.0.0',
    status: 'running',
    database: 'Firebase Firestore',
    project: 'toyshop-3779d',
    endpoints: {
      auth: '/api/auth (POST /register, /login, GET /profile)',
      products: '/api/products (GET /)',
      categories: '/api/categories (GET /)',
      health: '/api/health'
    },
    docs: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      products: 'GET /api/products',
      categories: 'GET /api/categories'
    }
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  console.log('🛑 Firebase connection closed');
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await initDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 ToyLand E-commerce API Server with Firebase');
    console.log('═══════════════════════════════════════════════');
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API Docs: http://localhost:${PORT}/`);
    console.log('═══════════════════════════════════════════════');
    console.log('📡 Available Endpoints:');
    console.log('   🔐 Auth: /api/auth');
    console.log('   📦 Products: /api/products');
    console.log('   📁 Categories: /api/categories');
    console.log('   � Cart: /api/cart');
    console.log('   �🔥 Database: Firebase Firestore (toyshop-3779d)');
    console.log('═══════════════════════════════════════════════\n');
  }).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  });
};

startServer();
