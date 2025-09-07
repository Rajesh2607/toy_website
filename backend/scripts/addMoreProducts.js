const { getFirestoreDB } = require('../config/firebase');
const { collection, addDoc, doc, setDoc, getDocs, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

// USD to INR conversion (1 USD = 83 INR approximately)
const usdToInr = (usdPrice) => Math.round(usdPrice * 83);

// Additional products to add to existing data
const additionalProducts = [
  // More Action Figures
  {
    id: 'robot-transformer',
    name: 'Transforming Robot Figure',
    price: usdToInr(32.99),
    originalPrice: usdToInr(39.99),
    discountPercentage: 18,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'action-figures',
    categoryName: 'Action Figures',
    rating: 4.4,
    reviewCount: 78,
    description: 'Robot that transforms into a sports car with light-up features and sound effects.',
    inStock: true,
    stock: 22,
    colors: ['Red', 'Blue', 'Silver'],
    features: ['Transforms', 'Light effects', 'Sound effects', 'Durable'],
    brand: 'TransformToys',
    ageGroup: '6-14 years',
    weight: '350g',
    isActive: true,
    isFeatured: false,
    tags: ['robot', 'transformer', 'car', 'lights'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'space-ranger-figure',
    name: 'Space Ranger Action Figure',
    price: usdToInr(27.99),
    originalPrice: usdToInr(32.99),
    discountPercentage: 15,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'action-figures',
    categoryName: 'Action Figures',
    rating: 4.3,
    reviewCount: 95,
    description: 'Space-themed action figure with laser blaster and astronaut helmet.',
    inStock: true,
    stock: 19,
    colors: ['White', 'Silver', 'Blue'],
    features: ['Laser blaster', 'Removable helmet', 'Poseable', 'Space gear'],
    brand: 'GalaxyToys',
    ageGroup: '5-12 years',
    weight: '220g',
    isActive: true,
    isFeatured: false,
    tags: ['space', 'astronaut', 'laser', 'adventure'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // More Dolls
  {
    id: 'fairy-tale-doll',
    name: 'Enchanted Fairy Tale Doll',
    price: usdToInr(29.99),
    originalPrice: usdToInr(34.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'dolls',
    categoryName: 'Dolls',
    rating: 4.6,
    reviewCount: 143,
    description: 'Magical fairy tale doll with sparkly dress, wings, and wand accessories.',
    inStock: true,
    stock: 26,
    colors: ['Pink', 'Purple', 'Blue'],
    features: ['Sparkly dress', 'Removable wings', 'Magic wand', 'Brush included'],
    brand: 'FairyLand',
    ageGroup: '3-10 years',
    weight: '280g',
    isActive: true,
    isFeatured: true,
    tags: ['fairy', 'magic', 'wings', 'sparkly'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'baby-care-doll',
    name: 'Interactive Baby Care Doll',
    price: usdToInr(45.99),
    originalPrice: usdToInr(52.99),
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'dolls',
    categoryName: 'Dolls',
    rating: 4.5,
    reviewCount: 167,
    description: 'Realistic baby doll that cries, laughs, and responds to care with accessories.',
    inStock: true,
    stock: 15,
    colors: ['Pink', 'Blue'],
    features: ['Crying sounds', 'Laughing sounds', 'Feeding bottle', 'Diapers included'],
    brand: 'BabyCare',
    ageGroup: '4-8 years',
    weight: '400g',
    isActive: true,
    isFeatured: false,
    tags: ['baby', 'interactive', 'care', 'realistic'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // More Educational Toys
  {
    id: 'coding-robot',
    name: 'Learn to Code Robot',
    price: usdToInr(89.99),
    originalPrice: usdToInr(99.99),
    discountPercentage: 10,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'educational',
    categoryName: 'Educational',
    rating: 4.8,
    reviewCount: 234,
    description: 'Programming robot that teaches coding concepts through fun activities and games.',
    inStock: true,
    stock: 12,
    colors: ['White', 'Blue'],
    features: ['Screen-free coding', 'Step-by-step guides', 'Multiple activities', 'STEM learning'],
    brand: 'CodeKids',
    ageGroup: '6-12 years',
    weight: '800g',
    isActive: true,
    isFeatured: true,
    tags: ['coding', 'programming', 'stem', 'robot'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'math-learning-game',
    name: 'Interactive Math Learning Game',
    price: usdToInr(36.99),
    originalPrice: usdToInr(42.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'educational',
    categoryName: 'Educational',
    rating: 4.4,
    reviewCount: 156,
    description: 'Fun math learning game with counting, addition, subtraction, and multiplication.',
    inStock: true,
    stock: 28,
    colors: ['Multicolor'],
    features: ['Touch screen', 'Progressive levels', 'Rewards system', 'Audio feedback'],
    brand: 'MathFun',
    ageGroup: '5-10 years',
    weight: '350g',
    isActive: true,
    isFeatured: false,
    tags: ['math', 'learning', 'counting', 'education'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // More Building Sets
  {
    id: 'architect-building-set',
    name: 'Architect Master Building Set',
    price: usdToInr(67.99),
    originalPrice: usdToInr(79.99),
    discountPercentage: 15,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'building',
    categoryName: 'Building Blocks',
    rating: 4.6,
    reviewCount: 198,
    description: 'Professional building set with 750 pieces for creating architectural masterpieces.',
    inStock: true,
    stock: 14,
    colors: ['Multicolor'],
    features: ['750 pieces', 'Architectural designs', 'Instruction manual', 'Premium quality'],
    brand: 'ArchitectToys',
    ageGroup: '8+ years',
    weight: '1.8kg',
    isActive: true,
    isFeatured: false,
    tags: ['architecture', 'building', 'professional', 'complex'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'gear-building-set',
    name: 'Motorized Gear Building Set',
    price: usdToInr(54.99),
    originalPrice: usdToInr(62.99),
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'building',
    categoryName: 'Building Blocks',
    rating: 4.5,
    reviewCount: 127,
    description: 'Mechanical building set with gears, motors, and moving parts for engineering fun.',
    inStock: true,
    stock: 17,
    colors: ['Gray', 'Yellow'],
    features: ['Motorized parts', 'Gears system', 'Moving mechanisms', 'STEM education'],
    brand: 'GearWorks',
    ageGroup: '7-14 years',
    weight: '1.3kg',
    isActive: true,
    isFeatured: false,
    tags: ['gears', 'motor', 'mechanical', 'engineering'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // More Vehicles
  {
    id: 'fire-truck-playset',
    name: 'Emergency Fire Truck Set',
    price: usdToInr(48.99),
    originalPrice: usdToInr(56.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'vehicles',
    categoryName: 'Vehicles',
    rating: 4.4,
    reviewCount: 112,
    description: 'Fire truck with extending ladder, water cannon, and firefighter figures.',
    inStock: true,
    stock: 21,
    colors: ['Red', 'Yellow'],
    features: ['Extending ladder', 'Water cannon', 'Sound effects', 'Firefighter figures'],
    brand: 'RescueTeam',
    ageGroup: '4-10 years',
    weight: '950g',
    isActive: true,
    isFeatured: false,
    tags: ['fire-truck', 'rescue', 'emergency', 'ladder'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'train-set-deluxe',
    name: 'Deluxe Electric Train Set',
    price: usdToInr(94.99),
    originalPrice: usdToInr(109.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'vehicles',
    categoryName: 'Vehicles',
    rating: 4.7,
    reviewCount: 189,
    description: 'Complete electric train set with tracks, stations, and realistic train sounds.',
    inStock: true,
    stock: 9,
    colors: ['Blue', 'Green'],
    features: ['Electric motor', 'Track system', 'Train station', 'Realistic sounds'],
    brand: 'RailMaster',
    ageGroup: '6+ years',
    weight: '2.2kg',
    isActive: true,
    isFeatured: true,
    tags: ['train', 'electric', 'tracks', 'realistic'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Arts & Crafts
  {
    id: 'art-easel-deluxe',
    name: 'Deluxe Art Easel Set',
    price: usdToInr(72.99),
    originalPrice: usdToInr(84.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'arts-crafts',
    categoryName: 'Arts & Crafts',
    rating: 4.5,
    reviewCount: 143,
    description: 'Double-sided art easel with whiteboard, chalkboard, and complete art supply set.',
    inStock: true,
    stock: 11,
    colors: ['Wood', 'Natural'],
    features: ['Double-sided', 'Whiteboard & chalkboard', 'Art supplies included', 'Adjustable height'],
    brand: 'ArtMaster',
    ageGroup: '4-12 years',
    weight: '3.5kg',
    isActive: true,
    isFeatured: false,
    tags: ['art', 'easel', 'drawing', 'creative'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'craft-jewelry-kit',
    name: 'Jewelry Making Craft Kit',
    price: usdToInr(28.99),
    originalPrice: usdToInr(34.99),
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'arts-crafts',
    categoryName: 'Arts & Crafts',
    rating: 4.3,
    reviewCount: 87,
    description: 'Complete jewelry making kit with beads, strings, and tools for creating beautiful accessories.',
    inStock: true,
    stock: 24,
    colors: ['Multicolor'],
    features: ['500+ beads', 'Different strings', 'Making tools', 'Instruction guide'],
    brand: 'CraftGirls',
    ageGroup: '6-14 years',
    weight: '450g',
    isActive: true,
    isFeatured: false,
    tags: ['jewelry', 'beads', 'crafting', 'accessories'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Musical Instruments
  {
    id: 'kids-piano-keyboard',
    name: 'Electronic Piano Keyboard',
    price: usdToInr(65.99),
    originalPrice: usdToInr(76.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'musical',
    categoryName: 'Musical Instruments',
    rating: 4.6,
    reviewCount: 176,
    description: '61-key electronic piano with different sounds, rhythms, and learning modes.',
    inStock: true,
    stock: 13,
    colors: ['Black', 'White'],
    features: ['61 keys', 'Multiple sounds', 'Rhythm patterns', 'Learning mode'],
    brand: 'MusicKids',
    ageGroup: '5+ years',
    weight: '1.8kg',
    isActive: true,
    isFeatured: false,
    tags: ['piano', 'keyboard', 'music', 'learning'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'drum-set-kids',
    name: 'Kids Electronic Drum Set',
    price: usdToInr(89.99),
    originalPrice: usdToInr(104.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'musical',
    categoryName: 'Musical Instruments',
    rating: 4.4,
    reviewCount: 134,
    description: 'Electronic drum set with realistic sounds, headphones, and practice modes.',
    inStock: true,
    stock: 8,
    colors: ['Black', 'Blue'],
    features: ['Electronic pads', 'Headphones included', 'Practice modes', 'Volume control'],
    brand: 'RhythmKids',
    ageGroup: '6+ years',
    weight: '2.5kg',
    isActive: true,
    isFeatured: false,
    tags: ['drums', 'electronic', 'music', 'rhythm'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Electronic Toys
  {
    id: 'smart-watch-kids',
    name: 'Kids Smart Watch',
    price: usdToInr(74.99),
    originalPrice: usdToInr(89.99),
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'electronic',
    categoryName: 'Electronic Toys',
    rating: 4.3,
    reviewCount: 267,
    description: 'Educational smart watch with games, camera, calculator, and learning activities.',
    inStock: true,
    stock: 19,
    colors: ['Blue', 'Pink', 'Black'],
    features: ['Camera', 'Games', 'Calculator', 'Learning activities'],
    brand: 'SmartKids',
    ageGroup: '4-12 years',
    weight: '150g',
    isActive: true,
    isFeatured: true,
    tags: ['smart-watch', 'camera', 'games', 'educational'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function addMoreProducts() {
  try {
    console.log('🚀 Adding more products to Firestore database...');
    
    const db = getFirestoreDB();

    // Add additional products
    console.log('📦 Adding more products...');
    for (const product of additionalProducts) {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, product);
    }
    console.log(`✅ Added ${additionalProducts.length} more products to Firestore`);

    // Get current totals
    const productsRef = collection(db, 'products');
    const productSnapshot = await getDocs(productsRef);
    const totalProducts = productSnapshot.size;

    const categoriesRef = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesRef);
    const totalCategories = categorySnapshot.size;

    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersRef);
    const totalUsers = userSnapshot.size;

    console.log('\n🎉 Database expansion completed successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📁 Total Categories: ${totalCategories}`);
    console.log(`📦 Total Products: ${totalProducts} (All with INR pricing)`);
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🛍️ Product Categories Available:');
    console.log('   🦸 Action Figures');
    console.log('   👸 Dolls');
    console.log('   📚 Educational');
    console.log('   🧱 Building Blocks');
    console.log('   🚗 Vehicles');
    console.log('   🧩 Puzzles & Games');
    console.log('   ⚽ Outdoor Toys');
    console.log('   🎨 Arts & Crafts');
    console.log('   🎵 Musical Instruments');
    console.log('   🎲 Board Games');
    console.log('   📱 Electronic Toys');
    console.log('   👶 Baby & Toddler');
    console.log('═══════════════════════════════════════════════');
    console.log('💰 Price Range: ₹1,657 - ₹10,787');
    console.log('🔥 Database: Firebase Firestore (toyshop-3779d)');
    console.log('✅ Your comprehensive toy store database is ready!');
    
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

// Initialize and add products
async function initialize() {
  try {
    console.log('🔥 Firebase initialized successfully');
    await addMoreProducts();
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initialize();
