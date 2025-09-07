const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Test connection first
const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    console.log('🌐 Database: toy_shop');
    console.log('🏢 Cluster: toy.yedbvnh.mongodb.net');
    
    // Connect with proper timeout settings
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📊 Connected to database: ${mongoose.connection.db.databaseName}`);
    
    // List existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.map(c => c.name).join(', '));
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n🚨 IP WHITELIST ISSUE:');
      console.log('   Go to MongoDB Atlas → Network Access → Add IP Address');
      console.log('   Add 0.0.0.0/0 to allow all IPs (for testing)');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🚨 AUTHENTICATION ISSUE:');
      console.log('   Check your username/password in the connection string');
    }
    
    return false;
  }
};

// USD to INR conversion function
const usdToInr = (usd) => Math.round(usd * 83);

// Complete data seeding function
const seedCompleteData = async () => {
  try {
    console.log('🌱 Starting complete database seeding...');
    
    // Get database reference
    const db = mongoose.connection.db;
    
    // Clear existing collections
    console.log('🗑️ Clearing existing data...');
    try {
      await db.collection('categories').drop();
      await db.collection('products').drop(); 
      await db.collection('users').drop();
      console.log('   ✅ Existing collections cleared');
    } catch (error) {
      console.log('   ℹ️ No existing collections to clear');
    }

    // 1. CREATE CATEGORIES
    console.log('\n📁 Creating categories...');
    const categories = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Action Figures',
        slug: 'action-figures',
        description: 'Superhero action figures and collectibles for adventure play',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Dolls',
        slug: 'dolls',
        description: 'Beautiful dolls and doll accessories for creative storytelling',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Educational',
        slug: 'educational',
        description: 'Learning toys that make education fun and engaging',
        image: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Building Blocks',
        slug: 'building-blocks',
        description: 'Construction and building toys for developing creativity',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Vehicles',
        slug: 'vehicles',
        description: 'Cars, trucks, and vehicle toys for speed enthusiasts',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Puzzles',
        slug: 'puzzles',
        description: 'Jigsaw puzzles and brain teasers for problem-solving skills',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Musical Toys',
        slug: 'musical',
        description: 'Musical instruments and sound toys for budding musicians',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Outdoor Games',
        slug: 'outdoor',
        description: 'Sports and outdoor activity toys for active play',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Electronic Toys',
        slug: 'electronics',
        description: 'High-tech electronic toys and gadgets for modern kids',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        isActive: true,
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('categories').insertMany(categories);
    console.log(`   ✅ Created ${categories.length} categories`);

    // 2. CREATE PRODUCTS WITH INR PRICING
    console.log('\n📦 Creating products with Indian Rupee pricing...');
    const products = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Super Hero Action Figure',
        description: 'Amazing superhero action figure with movable joints and cape. Perfect for imaginative play and adventure stories.',
        price: usdToInr(24.99), // ₹2,074
        originalPrice: usdToInr(29.99), // ₹2,489
        discountPercentage: 17,
        category: categories[0]._id, // Action Figures
        brand: 'HeroToys',
        images: [
          {
            public_id: 'hero-figure-1',
            url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop'
          }
        ],
        colors: [
          { name: 'Red', code: '#FF0000' },
          { name: 'Blue', code: '#0000FF' },
          { name: 'Green', code: '#00FF00' }
        ],
        stock: 50,
        inStock: true,
        features: ['Movable joints', 'Cape included', 'Premium quality plastic', 'Age 3+'],
        specifications: [
          { name: 'Material', value: 'High-quality plastic' },
          { name: 'Height', value: '15 cm' },
          { name: 'Weight', value: '200g' }
        ],
        ageRange: { min: 3, max: 10 },
        ratings: { average: 4.8, count: 156 },
        reviews: [],
        tags: ['superhero', 'action', 'movable'],
        isActive: true,
        isFeatured: true,
        salesCount: 234,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Princess Castle Playset',
        description: 'Beautiful castle playset with multiple rooms, furniture, and princess dolls. Create magical fairy tale adventures.',
        price: usdToInr(89.99), // ₹7,469
        originalPrice: usdToInr(109.99), // ₹9,129
        discountPercentage: 18,
        category: categories[1]._id, // Dolls
        brand: 'FairyLand',
        images: [
          {
            public_id: 'princess-castle-1',
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
          }
        ],
        colors: [
          { name: 'Pink', code: '#FFC0CB' },
          { name: 'Purple', code: '#800080' }
        ],
        stock: 25,
        inStock: true,
        features: ['Multiple rooms', '3 princess dolls', 'Furniture set', 'LED lights'],
        specifications: [
          { name: 'Material', value: 'Durable plastic' },
          { name: 'Dimensions', value: '40x30x35 cm' },
          { name: 'Weight', value: '1.2 kg' }
        ],
        ageRange: { min: 3, max: 8 },
        ratings: { average: 4.9, count: 234 },
        reviews: [],
        tags: ['princess', 'castle', 'playset', 'dolls'],
        isActive: true,
        isFeatured: true,
        salesCount: 156,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Learning Tablet for Kids',
        description: 'Interactive learning tablet with educational games, puzzles, and activities. Perfect for early learning.',
        price: usdToInr(49.99), // ₹4,149
        originalPrice: usdToInr(59.99), // ₹4,979
        discountPercentage: 17,
        category: categories[2]._id, // Educational
        brand: 'EduTech',
        images: [
          {
            public_id: 'learning-tablet-1',
            url: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=500&h=500&fit=crop'
          }
        ],
        colors: [
          { name: 'Blue', code: '#0000FF' },
          { name: 'Green', code: '#00FF00' }
        ],
        stock: 40,
        inStock: true,
        features: ['50+ learning games', 'Voice recognition', 'Parental controls', 'Durable design'],
        specifications: [
          { name: 'Screen Size', value: '7 inches' },
          { name: 'Battery Life', value: '6 hours' },
          { name: 'Age Range', value: '2-6 years' }
        ],
        ageRange: { min: 2, max: 6 },
        ratings: { average: 4.7, count: 189 },
        reviews: [],
        tags: ['educational', 'tablet', 'learning', 'games'],
        isActive: true,
        isFeatured: true,
        salesCount: 98,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Building Block Set',
        description: 'Creative building blocks set with 200+ colorful pieces. Develops creativity and motor skills.',
        price: usdToInr(34.99), // ₹2,904
        originalPrice: usdToInr(39.99), // ₹3,319
        discountPercentage: 13,
        category: categories[3]._id, // Building Blocks
        brand: 'BuildMax',
        images: [
          {
            public_id: 'building-blocks-1',
            url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop'
          }
        ],
        colors: [
          { name: 'Multi-Color', code: 'multicolor' }
        ],
        stock: 0,
        inStock: false,
        features: ['200+ pieces', 'Compatible with major brands', 'Storage box included', 'Non-toxic materials'],
        specifications: [
          { name: 'Pieces', value: '200+' },
          { name: 'Material', value: 'ABS Plastic' },
          { name: 'Box Size', value: '30x20x15 cm' }
        ],
        ageRange: { min: 3, max: 12 },
        ratings: { average: 4.6, count: 298 },
        reviews: [],
        tags: ['building', 'blocks', 'creative', 'construction'],
        isActive: true,
        isFeatured: false,
        salesCount: 445,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Remote Control Race Car',
        description: 'High-speed remote control car with LED lights and realistic engine sounds. Perfect for racing fun.',
        price: usdToInr(59.99), // ₹4,979
        originalPrice: usdToInr(69.99), // ₹5,809
        discountPercentage: 14,
        category: categories[4]._id, // Vehicles
        brand: 'SpeedRacer',
        images: [
          {
            public_id: 'rc-car-1',
            url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop'
          }
        ],
        colors: [
          { name: 'Red', code: '#FF0000' },
          { name: 'Blue', code: '#0000FF' },
          { name: 'Yellow', code: '#FFFF00' }
        ],
        stock: 35,
        inStock: true,
        features: ['Remote control', 'LED lights', 'Sound effects', 'Rechargeable battery'],
        specifications: [
          { name: 'Speed', value: '15 km/h' },
          { name: 'Range', value: '50 meters' },
          { name: 'Battery', value: 'Rechargeable Li-ion' }
        ],
        ageRange: { min: 6, max: 14 },
        ratings: { average: 4.5, count: 167 },
        reviews: [],
        tags: ['remote control', 'car', 'racing', 'speed'],
        isActive: true,
        isFeatured: true,
        salesCount: 287,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('products').insertMany(products);
    console.log(`   ✅ Created ${products.length} products with INR pricing`);

    // 3. CREATE USERS
    console.log('\n👥 Creating users...');
    const users = [
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@toyland.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        isEmailVerified: true,
        phone: '9876543210',
        avatar: {
          public_id: 'admin-avatar',
          url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        addresses: [],
        wishlist: [],
        compareList: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Customer',
        email: 'customer@toyland.com',
        password: await bcrypt.hash('customer123', 12),
        role: 'user',
        isEmailVerified: true,
        phone: '9123456789',
        avatar: {
          public_id: 'customer-avatar',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        addresses: [
          {
            type: 'home',
            firstName: 'John',
            lastName: 'Customer',
            addressLine1: '123 Main Street',
            addressLine2: 'Near Central Mall',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            phone: '9123456789',
            isDefault: true
          }
        ],
        wishlist: [products[0]._id, products[1]._id],
        compareList: [products[2]._id],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya@example.com',
        password: await bcrypt.hash('priya123', 12),
        role: 'user',
        isEmailVerified: false,
        phone: '9876543211',
        avatar: {
          public_id: 'priya-avatar',
          url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=150&h=150&fit=crop&crop=face'
        },
        addresses: [
          {
            type: 'home',
            firstName: 'Priya',
            lastName: 'Sharma',
            addressLine1: '456 Garden Road',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            phone: '9876543211',
            isDefault: true
          }
        ],
        wishlist: [products[2]._id, products[4]._id],
        compareList: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await db.collection('users').insertMany(users);
    console.log(`   ✅ Created ${users.length} users`);

    // Update category product counts
    for (let category of categories) {
      const productCount = products.filter(p => p.category.equals(category._id)).length;
      await db.collection('categories').updateOne(
        { _id: category._id },
        { $set: { productCount } }
      );
    }

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 FINAL STATISTICS:');
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`📦 Products: ${products.length} (All with ₹ INR pricing)`);
    console.log(`👥 Users: ${users.length} (1 admin + 2 customers)`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔐 TEST ACCOUNTS CREATED:');
    console.log('   👤 Admin: admin@toyland.com / admin123');
    console.log('   👤 Customer: customer@toyland.com / customer123');
    console.log('   👤 Customer 2: priya@example.com / priya123');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💰 SAMPLE PRODUCTS (INR PRICING):');
    console.log('   🦸 Super Hero Action Figure: ₹2,074 (was ₹2,489)');
    console.log('   👸 Princess Castle Playset: ₹7,469 (was ₹9,129)');
    console.log('   📱 Learning Tablet: ₹4,149 (was ₹4,979)');
    console.log('   🧱 Building Block Set: ₹2,904 (was ₹3,319) [Out of Stock]');
    console.log('   🚗 RC Race Car: ₹4,979 (was ₹5,809)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 YOUR E-COMMERCE DATABASE IS READY!');
    console.log('   Start your server with: npm run dev');
    console.log('   API Base: http://localhost:5000/api');
    
    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return false;
  }
};

// Main execution function
const main = async () => {
  console.log('🎯 ToyLand E-commerce Database Setup');
  console.log('====================================\n');
  
  // Test connection first
  const connectionSuccess = await testConnection();
  
  if (!connectionSuccess) {
    console.log('\n❌ Connection failed. Please fix the connection issues and try again.');
    process.exit(1);
  }
  
  // Proceed with seeding if connection is successful
  console.log('\n🌱 Connection successful! Proceeding with database seeding...');
  
  const seedingSuccess = await seedCompleteData();
  
  if (seedingSuccess) {
    console.log('\n✅ All operations completed successfully!');
  } else {
    console.log('\n❌ Seeding failed. Check the error messages above.');
  }
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n🛑 Database connection closed.');
  process.exit(0);
};

// Run the script
main().catch(error => {
  console.error('❌ Script execution failed:', error);
  process.exit(1);
});
