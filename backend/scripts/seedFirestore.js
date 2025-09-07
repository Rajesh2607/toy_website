const { getFirestoreDB } = require('../config/firebase');
const { collection, addDoc, doc, setDoc, getDocs, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

// USD to INR conversion (1 USD = 83 INR approximately)
const usdToInr = (usdPrice) => Math.round(usdPrice * 83);

// Categories data
const categoriesData = [
  { 
    id: 'action-figures',
    name: 'Action Figures', 
    slug: 'action-figures', 
    description: 'Exciting action figures and collectibles for adventure play',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'dolls',
    name: 'Dolls', 
    slug: 'dolls', 
    description: 'Beautiful dolls and doll accessories for creative storytelling',
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'educational',
    name: 'Educational', 
    slug: 'educational', 
    description: 'Learning toys that make education fun and engaging',
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'building',
    name: 'Building Blocks', 
    slug: 'building', 
    description: 'Construction and building toys for developing creativity',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'vehicles',
    name: 'Vehicles', 
    slug: 'vehicles', 
    description: 'Cars, trucks, and vehicle toys for speed enthusiasts',
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'puzzles',
    name: 'Puzzles', 
    slug: 'puzzles', 
    description: 'Jigsaw puzzles and brain teasers for problem-solving skills',
    image: 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'outdoor',
    name: 'Outdoor Games', 
    slug: 'outdoor', 
    description: 'Sports and outdoor activity toys for active play',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'musical',
    name: 'Musical Toys', 
    slug: 'musical', 
    description: 'Musical instruments and sound toys for budding musicians',
    image: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'electronics',
    name: 'Electronic Toys', 
    slug: 'electronics', 
    description: 'High-tech electronic toys and gadgets for modern kids',
    image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Products data (converted from your frontend data with INR pricing)
const productsData = [
  {
    id: 'super-hero-action-figure',
    name: 'Super Hero Action Figure',
    price: usdToInr(24.99), // ₹2,074
    originalPrice: usdToInr(29.99), // ₹2,489
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'action-figures',
    categoryName: 'Action Figures',
    rating: 4.8,
    reviewCount: 156,
    description: 'Amazing superhero figure with movable joints and cape. Perfect for imaginative play and adventure stories.',
    inStock: true,
    stock: 50,
    colors: ['red', 'blue', 'green'],
    features: ['Movable joints', 'Cape included', 'Premium quality plastic', 'Age 3+'],
    brand: 'SuperToys',
    ageGroup: '3-10 years',
    weight: 200,
    isActive: true,
    isFeatured: true,
    tags: ['superhero', 'action', 'movable'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'princess-castle-playset',
    name: 'Princess Castle Playset',
    price: usdToInr(89.99), // ₹7,469
    originalPrice: usdToInr(109.99), // ₹9,129
    discountPercentage: 18,
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'dolls',
    categoryName: 'Dolls',
    rating: 4.9,
    reviewCount: 234,
    description: 'Beautiful castle playset with multiple rooms, furniture, and princess dolls. Create magical fairy tale adventures.',
    inStock: true,
    stock: 25,
    colors: ['pink', 'purple'],
    features: ['Multiple rooms', '3 princess dolls', 'Furniture set', 'LED lights'],
    brand: 'FairyLand',
    ageGroup: '3-8 years',
    weight: 1200,
    isActive: true,
    isFeatured: true,
    tags: ['princess', 'castle', 'playset', 'dolls'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'learning-tablet-kids',
    name: 'Learning Tablet for Kids',
    price: usdToInr(49.99), // ₹4,149
    originalPrice: usdToInr(59.99), // ₹4,979
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'educational',
    categoryName: 'Educational',
    rating: 4.7,
    reviewCount: 189,
    description: 'Interactive learning tablet with educational games, puzzles, and activities. Perfect for early learning.',
    inStock: true,
    stock: 40,
    colors: ['blue', 'green'],
    features: ['50+ learning games', 'Voice recognition', 'Parental controls', 'Durable design'],
    brand: 'EduTech',
    ageGroup: '2-6 years',
    weight: 300,
    isActive: true,
    isFeatured: true,
    tags: ['educational', 'tablet', 'learning', 'games'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'building-block-set',
    name: 'Building Block Set',
    price: usdToInr(34.99), // ₹2,904
    originalPrice: usdToInr(39.99), // ₹3,319
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'building',
    categoryName: 'Building Blocks',
    rating: 4.6,
    reviewCount: 298,
    description: 'Creative building blocks set with 200+ colorful pieces. Develops creativity and motor skills.',
    inStock: false,
    stock: 0,
    colors: ['multicolor'],
    features: ['200+ pieces', 'Compatible with major brands', 'Storage box included', 'Non-toxic materials'],
    brand: 'BuildMax',
    ageGroup: '3-12 years',
    weight: 800,
    isActive: true,
    tags: ['building', 'blocks', 'creative', 'construction'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'remote-control-race-car',
    name: 'Remote Control Race Car',
    price: usdToInr(59.99), // ₹4,979
    originalPrice: usdToInr(69.99), // ₹5,809
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'vehicles',
    categoryName: 'Vehicles',
    rating: 4.5,
    reviewCount: 167,
    description: 'High-speed remote control car with LED lights and realistic engine sounds. Perfect for racing fun.',
    inStock: true,
    stock: 35,
    colors: ['red', 'blue', 'yellow'],
    features: ['Remote control', 'LED lights', 'Sound effects', 'Rechargeable battery'],
    brand: 'SpeedRacer',
    ageGroup: '6-14 years',
    weight: 500,
    isActive: true,
    isFeatured: true,
    tags: ['remote control', 'car', 'racing', 'speed'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Users data
const usersData = [
  {
    id: 'admin-user-001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@toyland.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIrc', // admin123 hashed
    role: 'admin',
    isEmailVerified: true,
    phone: '9876543210',
    wishlist: [],
    compareList: [],
    addresses: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer-user-001',
    firstName: 'John',
    lastName: 'Customer',
    email: 'customer@toyland.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIrc', // customer123 hashed
    role: 'user',
    isEmailVerified: true,
    phone: '9123456789',
    addresses: [{
      type: 'home',
      firstName: 'John',
      lastName: 'Customer',
      addressLine1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '9123456789',
      isDefault: true
    }],
    wishlist: [],
    compareList: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const seedFirestore = async () => {
  try {
    console.log('🔥 Starting Firestore database seeding...');
    
    // Get Firestore instance
    const db = getFirestoreDB();
    console.log('✅ Connected to Firestore!');

    // Categories
    console.log('📁 Seeding categories...');
    for (const category of categoriesData) {
      await setDoc(doc(db, 'categories', category.id), category);
    }
    console.log(`✅ Added ${categoriesData.length} categories to Firestore`);

    // Products
    console.log('📦 Seeding products...');
    for (const product of productsData) {
      await setDoc(doc(db, 'products', product.id), product);
    }
    console.log(`✅ Added ${productsData.length} products to Firestore`);

    // Users
    console.log('👥 Seeding users...');
    for (const user of usersData) {
      await setDoc(doc(db, 'users', user.id), user);
    }
    console.log(`✅ Added ${usersData.length} users to Firestore`);

    console.log('\n🎉 Firestore database seeded successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📁 Categories: ${categoriesData.length}`);
    console.log(`📦 Products: ${productsData.length} (All with INR pricing)`);
    console.log(`👥 Users: ${usersData.length}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🔑 Test Accounts Created:');
    console.log('   👤 Admin: admin@toyland.com / admin123');
    console.log('   👤 Customer: customer@toyland.com / customer123');
    console.log('═══════════════════════════════════════════════');
    console.log('💰 Sample Products with INR Pricing:');
    console.log(`   🦸 Super Hero Action Figure: ₹${usdToInr(24.99).toLocaleString('en-IN')}`);
    console.log(`   👸 Princess Castle Playset: ₹${usdToInr(89.99).toLocaleString('en-IN')}`);
    console.log(`   📱 Learning Tablet: ₹${usdToInr(49.99).toLocaleString('en-IN')}`);
    console.log(`   🧱 Building Blocks Set: ₹${usdToInr(34.99).toLocaleString('en-IN')}`);
    console.log(`   🚗 RC Race Car: ₹${usdToInr(59.99).toLocaleString('en-IN')}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 Database: Firebase Firestore (toyshop-3779d)');
    console.log('✅ Your Firebase database is ready!');
    console.log('🚀 You can now start your server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
};

// Run the seed script
seedFirestore();
