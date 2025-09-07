const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect with better error handling
const connectWithRetry = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`🔌 Attempt ${retries + 1}: Connecting to MongoDB Atlas...`);
      console.log('🌐 Cluster: toy.yedbvnh.mongodb.net');
      console.log('📊 Database: toy_shop');
      
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        bufferCommands: false,
      });

      console.log('✅ Successfully connected to MongoDB Atlas!');
      console.log(`📊 Connected to database: ${mongoose.connection.db.databaseName}`);
      console.log(`🏢 Host: ${mongoose.connection.host}`);
      return;

    } catch (error) {
      retries++;
      console.error(`❌ Connection attempt ${retries} failed:`, error.message);
      
      if (retries >= maxRetries) {
        console.error('💀 All connection attempts failed');
        
        if (error.message.includes('IP')) {
          console.log('\n🔥 IP WHITELIST ISSUE:');
          console.log('   Your network access shows 0.0.0.0/0 but connection still fails');
          console.log('   This could mean:');
          console.log('   1. Changes are still propagating (wait 2-3 minutes)');
          console.log('   2. Your cluster might be paused (free tier M0 clusters pause)');
          console.log('   3. Wrong credentials in .env file');
        }
        
        if (error.message.includes('authentication')) {
          console.log('\n🔑 AUTHENTICATION ISSUE:');
          console.log('   Check your MongoDB credentials in .env file');
          console.log('   Username: rajeshlingala26072004_db_user');
          console.log('   Password: LoxNNo6GyRTN918O');
        }
        
        throw error;
      }
      
      console.log(`⏳ Waiting 5 seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Sample data for seeding
const categoriesData = [
  {
    name: 'Action Figures',
    slug: 'action-figures',
    description: 'Exciting action figures and superhero toys for adventure play',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    isActive: true
  },
  {
    name: 'Dolls',
    slug: 'dolls',
    description: 'Beautiful dolls and doll accessories for creative storytelling',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    isActive: true
  },
  {
    name: 'Educational',
    slug: 'educational',
    description: 'Learning toys that make education fun and engaging',
    image: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=400',
    isActive: true
  },
  {
    name: 'Building Blocks',
    slug: 'building-blocks',
    description: 'Construction and building toys for developing creativity',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    isActive: true
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, trucks, and vehicle toys for speed enthusiasts',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    isActive: true
  }
];

const productsData = [
  {
    name: 'Super Hero Action Figure',
    description: 'Amazing superhero action figure with movable joints and cape. Perfect for imaginative play and adventure stories.',
    price: 2074, // ₹2,074 (converted from $24.99)
    originalPrice: 2489, // ₹2,489 (converted from $29.99)
    discountPercentage: 17,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
    category: 'action-figures',
    brand: 'SuperToys',
    colors: ['Red', 'Blue', 'Green'],
    features: ['Movable joints', 'Cape included', 'Premium quality plastic', 'Age 3+'],
    stock: 50,
    ageGroup: '3-10 years',
    weight: 200,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 156,
    tags: ['superhero', 'action', 'movable']
  },
  {
    name: 'Princess Castle Playset',
    description: 'Beautiful castle playset with multiple rooms, furniture, and princess dolls. Create magical fairy tale adventures.',
    price: 7469, // ₹7,469 (converted from $89.99)
    originalPrice: 9129, // ₹9,129 (converted from $109.99)
    discountPercentage: 18,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'dolls',
    brand: 'FairyLand',
    colors: ['Pink', 'Purple'],
    features: ['Multiple rooms', '3 princess dolls', 'Furniture set', 'LED lights'],
    stock: 25,
    ageGroup: '3-8 years',
    weight: 1200,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 234,
    tags: ['princess', 'castle', 'playset', 'dolls']
  },
  {
    name: 'Learning Tablet for Kids',
    description: 'Interactive learning tablet with educational games, puzzles, and activities. Perfect for early learning.',
    price: 4149, // ₹4,149 (converted from $49.99)
    originalPrice: 4979, // ₹4,979 (converted from $59.99)
    discountPercentage: 17,
    image: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=500',
    category: 'educational',
    brand: 'EduTech',
    colors: ['Blue', 'Green'],
    features: ['50+ learning games', 'Voice recognition', 'Parental controls', 'Durable design'],
    stock: 40,
    ageGroup: '2-6 years',
    weight: 300,
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 189,
    tags: ['educational', 'tablet', 'learning', 'games']
  },
  {
    name: 'Building Block Set',
    description: 'Creative building blocks set with 200+ colorful pieces. Develops creativity and motor skills.',
    price: 2904, // ₹2,904 (converted from $34.99)
    originalPrice: 3319, // ₹3,319 (converted from $39.99)
    discountPercentage: 13,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500',
    category: 'building-blocks',
    brand: 'BuildMax',
    colors: ['Multicolor'],
    features: ['200+ pieces', 'Compatible with major brands', 'Storage box included', 'Non-toxic materials'],
    stock: 0,
    ageGroup: '3-12 years',
    weight: 800,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 298,
    tags: ['building', 'blocks', 'creative', 'construction'],
    inStock: false
  },
  {
    name: 'Remote Control Race Car',
    description: 'High-speed remote control car with LED lights and realistic engine sounds. Perfect for racing fun.',
    price: 4979, // ₹4,979 (converted from $59.99)
    originalPrice: 5809, // ₹5,809 (converted from $69.99)
    discountPercentage: 14,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
    category: 'vehicles',
    brand: 'SpeedRacer',
    colors: ['Red', 'Blue', 'Yellow'],
    features: ['Remote control', 'LED lights', 'Sound effects', 'Rechargeable battery'],
    stock: 35,
    ageGroup: '6-14 years',
    weight: 500,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 167,
    tags: ['remote control', 'car', 'racing', 'speed']
  }
];

const usersData = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@toyland.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    isEmailVerified: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'customer@toyland.com',
    password: 'customer123',
    role: 'user',
    phone: '9123456789',
    isEmailVerified: true,
    addresses: [{
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '9123456789',
      isDefault: true
    }]
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@example.com',
    password: 'priya123',
    role: 'user',
    phone: '9876543211',
    isEmailVerified: true,
    addresses: [{
      type: 'home',
      firstName: 'Priya',
      lastName: 'Sharma',
      addressLine1: '456 Garden Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '9876543211',
      isDefault: true
    }]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectWithRetry();

    // Get database instance
    const db = mongoose.connection.db;
    
    console.log('\n🗑️ Clearing existing data...');
    await db.collection('categories').deleteMany({});
    console.log('   ✅ Categories cleared');
    await db.collection('products').deleteMany({});
    console.log('   ✅ Products cleared');
    await db.collection('users').deleteMany({});
    console.log('   ✅ Users cleared');

    // Create categories
    console.log('\n📁 Creating categories...');
    const categoriesResult = await db.collection('categories').insertMany(categoriesData);
    console.log(`   ✅ Created ${categoriesResult.insertedCount} categories`);
    
    categoriesData.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
    });

    // Create products
    console.log('\n📦 Creating products...');
    const productsResult = await db.collection('products').insertMany(productsData);
    console.log(`   ✅ Created ${productsResult.insertedCount} products`);
    
    productsData.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price.toLocaleString()} (${product.category})`);
    });

    // Hash passwords and create users
    console.log('\n👤 Creating users...');
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    
    const usersResult = await db.collection('users').insertMany(hashedUsers);
    console.log(`   ✅ Created ${usersResult.insertedCount} users`);
    
    usersData.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.role}) - ${user.email}`);
    });

    // Verify collections
    console.log('\n🔍 Verifying database...');
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections created: ${collections.map(c => c.name).join(', ')}`);

    // Get collection counts
    const categoryCount = await db.collection('categories').countDocuments();
    const productCount = await db.collection('products').countDocuments();
    const userCount = await db.collection('users').countDocuments();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 Final Database Statistics:');
    console.log(`📁 Categories: ${categoryCount}`);
    console.log(`📦 Products: ${productCount} (All with INR pricing)`);
    console.log(`👥 Users: ${userCount}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🔐 Test Accounts:');
    console.log('   👤 Admin: admin@toyland.com / admin123');
    console.log('   👤 Customer: customer@toyland.com / customer123');
    console.log('   👤 Customer 2: priya@example.com / priya123');
    console.log('═══════════════════════════════════════════════');
    console.log('💰 Sample Product Prices (INR):');
    console.log('   🦸 Super Hero Action Figure: ₹2,074');
    console.log('   👸 Princess Castle Playset: ₹7,469');
    console.log('   📱 Learning Tablet: ₹4,149');
    console.log('   🧱 Building Blocks: ₹2,904');
    console.log('   🏎️ RC Race Car: ₹4,979');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Your toy_shop database is ready!');
    console.log('🚀 You can now start your server with: npm run dev');

    await mongoose.connection.close();
    console.log('\n🛑 Database connection closed successfully');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    console.error('📋 Full error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🌐 DNS RESOLUTION ISSUE:');
      console.log('   Cannot resolve toy.yedbvnh.mongodb.net');
      console.log('   Check your internet connection');
      console.log('   Try using a different network');
    }
    
    process.exit(1);
  }
};

// Run the seeding
console.log('🌱 Starting MongoDB Atlas Database Seeding...');
console.log('📡 Target: toy_shop database');
console.log('🏢 Cluster: toy.yedbvnh.mongodb.net');
console.log('═══════════════════════════════════════════════\n');

seedDatabase();
