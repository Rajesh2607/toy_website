const mongoose = require('mongoose');
require('dotenv').config();

// Import Models
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// USD to INR conversion (1 USD = 83 INR approximately)
const usdToInr = (usdPrice) => Math.round(usdPrice * 83);

// Categories data
const categoriesData = [
  { 
    name: 'Action Figures', 
    slug: 'action-figures', 
    description: 'Exciting action figures and collectibles for adventure play',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Dolls', 
    slug: 'dolls', 
    description: 'Beautiful dolls and doll accessories for creative storytelling',
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Educational', 
    slug: 'educational', 
    description: 'Learning toys that make education fun and engaging',
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Building Blocks', 
    slug: 'building', 
    description: 'Construction and building toys for developing creativity',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Vehicles', 
    slug: 'vehicles', 
    description: 'Cars, trucks, and vehicle toys for speed enthusiasts',
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Puzzles', 
    slug: 'puzzles', 
    description: 'Jigsaw puzzles and brain teasers for problem-solving skills',
    image: 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Outdoor Games', 
    slug: 'outdoor', 
    description: 'Sports and outdoor activity toys for active play',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Musical Toys', 
    slug: 'musical', 
    description: 'Musical instruments and sound toys for budding musicians',
    image: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  { 
    name: 'Electronic Toys', 
    slug: 'electronics', 
    description: 'High-tech electronic toys and gadgets for modern kids',
    image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

// Products data (all 12 products from your frontend)
const productsData = [
  {
    name: 'Super Hero Action Figure',
    price: usdToInr(24.99),
    originalPrice: usdToInr(29.99),
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'action-figures',
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
    tags: ['superhero', 'action', 'movable']
  },
  {
    name: 'Princess Castle Playset',
    price: usdToInr(89.99),
    originalPrice: usdToInr(109.99),
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dolls',
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
    tags: ['princess', 'castle', 'playset', 'dolls']
  },
  {
    name: 'Learning Tablet for Kids',
    price: usdToInr(49.99),
    originalPrice: usdToInr(59.99),
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'educational',
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
    tags: ['educational', 'tablet', 'learning', 'games']
  },
  {
    name: 'Building Block Set',
    price: usdToInr(34.99),
    originalPrice: usdToInr(39.99),
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'building',
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
    tags: ['building', 'blocks', 'creative', 'construction']
  },
  {
    name: 'Remote Control Race Car',
    price: usdToInr(59.99),
    originalPrice: usdToInr(69.99),
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'vehicles',
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
    tags: ['remote control', 'car', 'racing', 'speed']
  },
  {
    name: 'Colorful Jigsaw Puzzle',
    price: usdToInr(19.99),
    originalPrice: usdToInr(24.99),
    image: 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'puzzles',
    rating: 4.4,
    reviewCount: 145,
    description: '500-piece jigsaw puzzle with beautiful artwork. Great for developing problem-solving skills.',
    inStock: true,
    stock: 60,
    colors: ['multicolor'],
    features: ['500 pieces', 'Premium cardboard', 'Beautiful artwork', 'Storage box'],
    brand: 'PuzzleMaster',
    ageGroup: '8+ years',
    weight: 400,
    isActive: true,
    tags: ['puzzle', 'jigsaw', 'problem-solving', 'artwork']
  },
  {
    name: 'Stuffed Animal Bear',
    price: usdToInr(29.99),
    originalPrice: usdToInr(34.99),
    image: 'https://images.pexels.com/photos/236530/pexels-photo-236530.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'dolls',
    rating: 4.9,
    reviewCount: 312,
    description: 'Soft and cuddly teddy bear made with premium materials. Perfect companion for bedtime and play.',
    inStock: true,
    stock: 75,
    colors: ['brown', 'white', 'pink'],
    features: ['Super soft fabric', 'Hypoallergenic stuffing', 'Machine washable', 'Safety tested'],
    brand: 'CuddleBear',
    ageGroup: '0-8 years',
    weight: 350,
    isActive: true,
    isFeatured: true,
    tags: ['teddy bear', 'soft', 'cuddly', 'stuffed animal']
  },
  {
    name: 'Science Experiment Kit',
    price: usdToInr(39.99),
    originalPrice: usdToInr(49.99),
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'educational',
    rating: 4.8,
    reviewCount: 201,
    description: 'Complete science experiment kit with 25+ experiments. Perfect for curious young scientists.',
    inStock: true,
    stock: 30,
    colors: ['blue', 'green'],
    features: ['25+ experiments', 'Safety equipment included', 'Instruction manual', 'STEM learning'],
    brand: 'ScienceWiz',
    ageGroup: '8-14 years',
    weight: 1000,
    isActive: true,
    isFeatured: true,
    tags: ['science', 'experiments', 'STEM', 'learning']
  },
  {
    name: 'Musical Keyboard Piano',
    price: usdToInr(79.99),
    originalPrice: usdToInr(99.99),
    image: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'musical',
    rating: 4.6,
    reviewCount: 178,
    description: '37-key electronic keyboard with multiple sounds, rhythms, and learning modes. Perfect for budding musicians.',
    inStock: true,
    stock: 20,
    colors: ['black', 'white'],
    features: ['37 keys', '100+ sounds', 'Recording function', 'Demo songs'],
    brand: 'MelodyMaker',
    ageGroup: '5-15 years',
    weight: 1500,
    isActive: true,
    tags: ['keyboard', 'piano', 'music', 'electronic']
  },
  {
    name: 'Football Set with Goal',
    price: usdToInr(44.99),
    originalPrice: usdToInr(54.99),
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'outdoor',
    rating: 4.7,
    reviewCount: 143,
    description: 'Complete football set with inflatable goal, ball, and pump. Perfect for outdoor play and exercise.',
    inStock: true,
    stock: 45,
    colors: ['white', 'black'],
    features: ['Inflatable goal', 'Size 3 football', 'Hand pump included', 'Weather resistant'],
    brand: 'SportsFun',
    ageGroup: '5-12 years',
    weight: 2000,
    isActive: true,
    tags: ['football', 'sports', 'outdoor', 'exercise']
  },
  {
    name: 'Electronic Robot Dog',
    price: usdToInr(129.99),
    originalPrice: usdToInr(149.99),
    image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'electronics',
    rating: 4.5,
    reviewCount: 89,
    description: 'Interactive robot dog with voice commands, tricks, and realistic movements. The perfect electronic pet.',
    inStock: true,
    stock: 15,
    colors: ['white', 'gray'],
    features: ['Voice commands', 'Dancing & tricks', 'Touch sensors', 'Rechargeable'],
    brand: 'RoboFriend',
    ageGroup: '6+ years',
    weight: 800,
    isActive: true,
    isFeatured: true,
    tags: ['robot', 'electronic', 'pet', 'interactive']
  },
  {
    name: 'Art & Craft Mega Set',
    price: usdToInr(54.99),
    originalPrice: usdToInr(64.99),
    image: 'https://images.pexels.com/photos/1145720/pexels-photo-1145720.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'educational',
    rating: 4.8,
    reviewCount: 267,
    description: 'Complete art and craft set with 150+ pieces including colors, brushes, papers, and craft materials.',
    inStock: true,
    stock: 55,
    colors: ['multicolor'],
    features: ['150+ pieces', 'Watercolors & brushes', 'Craft papers', 'Instruction booklet'],
    brand: 'ArtMaster',
    ageGroup: '5-12 years',
    weight: 1100,
    isActive: true,
    isFeatured: true,
    tags: ['art', 'craft', 'creative', 'drawing']
  }
];

// Sample users data
const usersData = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@toyland.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'customer@toyland.com',
    password: 'customer123',
    role: 'user',
    phone: '9123456789'
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@example.com',
    password: 'priya123',
    role: 'user',
    phone: '9876543211'
  }
];

const seedAtlasDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('🌐 Target database: toy');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🏢 Host: ${mongoose.connection.host}`);

    // Clear existing data
    console.log('\n🗑️ Clearing existing data...');
    await Product.deleteMany({});
    console.log('   ✅ Products cleared');
    await Category.deleteMany({});
    console.log('   ✅ Categories cleared');
    await User.deleteMany({});
    console.log('   ✅ Users cleared');

    // Create categories
    console.log('\n📁 Creating categories...');
    const createdCategories = await Category.create(categoriesData);
    console.log(`   ✅ Created ${createdCategories.length} categories`);
    
    createdCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
    });

    // Create products
    console.log('\n📦 Creating products...');
    const createdProducts = await Product.create(productsData);
    console.log(`   ✅ Created ${createdProducts.length} products`);
    
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
    });

    // Create users
    console.log('\n👤 Creating users...');
    const createdUsers = await User.create(usersData);
    console.log(`   ✅ Created ${createdUsers.length} users`);
    
    createdUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.role}) - ${user.email}`);
    });

    // Verify collections were created
    console.log('\n🔍 Verifying collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections in database:');
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });

    console.log('\n🎉 MongoDB Atlas database seeded successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 Final Statistics:');
    console.log(`📁 Categories: ${createdCategories.length}`);
    console.log(`📦 Products: ${createdProducts.length}`);
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🔐 Login Credentials:');
    console.log('📧 Admin Email: admin@toyland.com');
    console.log('🔑 Admin Password: admin123');
    console.log('📧 Customer Email: customer@toyland.com');
    console.log('🔑 Customer Password: customer123');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Your MongoDB Atlas database is ready!');
    console.log('🚀 You can now start your server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB Atlas:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure your IP (146.70.246.164) is whitelisted in MongoDB Atlas');
    console.log('2. Go to https://cloud.mongodb.com/ → Network Access → Add IP Address');
    console.log('3. Add 146.70.246.164 or 0.0.0.0/0 for testing');
    console.log('4. Wait 1-2 minutes for changes to take effect');
    process.exit(1);
  }
};

// Run the seed script
seedAtlasDatabase();
