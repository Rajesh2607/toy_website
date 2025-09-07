const { getFirestoreDB } = require('../config/firebase');
const { collection, addDoc, doc, setDoc, getDocs, deleteDoc } = require('firebase/firestore');
require('dotenv').config();

// USD to INR conversion (1 USD = 83 INR approximately)
const usdToInr = (usdPrice) => Math.round(usdPrice * 83);

// Expanded Categories data
const categoriesData = [
  { 
    id: 'action-figures',
    name: 'Action Figures', 
    slug: 'action-figures', 
    description: 'Exciting action figures and collectibles for adventure play',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 1,
    productCount: 0,
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
    sortOrder: 2,
    productCount: 0,
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
    sortOrder: 3,
    productCount: 0,
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
    sortOrder: 4,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'vehicles',
    name: 'Vehicles', 
    slug: 'vehicles', 
    description: 'Cars, trucks, planes and all kinds of moving vehicles',
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 5,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'puzzles',
    name: 'Puzzles & Games', 
    slug: 'puzzles', 
    description: 'Mind-challenging puzzles and entertaining games',
    image: 'https://images.pexels.com/photos/1314416/pexels-photo-1314416.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 6,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'outdoor',
    name: 'Outdoor Toys', 
    slug: 'outdoor', 
    description: 'Sports and outdoor activity toys for active play',
    image: 'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 7,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'arts-crafts',
    name: 'Arts & Crafts', 
    slug: 'arts-crafts', 
    description: 'Creative art supplies and craft kits for artistic expression',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 8,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'musical',
    name: 'Musical Instruments', 
    slug: 'musical', 
    description: 'Musical toys and instruments for budding musicians',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 9,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'board-games',
    name: 'Board Games', 
    slug: 'board-games', 
    description: 'Classic and modern board games for family fun',
    image: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 10,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'electronic',
    name: 'Electronic Toys', 
    slug: 'electronic', 
    description: 'High-tech electronic toys and gadgets',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 11,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    id: 'baby-toddler',
    name: 'Baby & Toddler', 
    slug: 'baby-toddler', 
    description: 'Safe and engaging toys for babies and toddlers',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    sortOrder: 12,
    productCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Expanded Products data with more variety
const productsData = [
  // Action Figures
  {
    id: 'superhero-action-figure',
    name: 'Super Hero Action Figure',
    price: usdToInr(24.99),
    originalPrice: usdToInr(29.99),
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: 'action-figures',
    categoryName: 'Action Figures',
    rating: 4.5,
    reviewCount: 124,
    description: 'Poseable superhero action figure with removable accessories and cape. Perfect for imaginative play and collecting.',
    inStock: true,
    stock: 25,
    colors: ['Red', 'Blue', 'Green'],
    features: ['Poseable joints', 'Removable cape', 'Accessories included', 'Collectible series'],
    brand: 'HeroToys',
    ageGroup: '6-12 years',
    weight: '200g',
    isActive: true,
    isFeatured: true,
    tags: ['superhero', 'action', 'collectible', 'adventure'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ninja-warrior-figure',
    name: 'Ninja Warrior Action Figure',
    price: usdToInr(19.99),
    originalPrice: usdToInr(24.99),
    discountPercentage: 20,
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'action-figures',
    categoryName: 'Action Figures',
    rating: 4.3,
    reviewCount: 89,
    description: 'Stealth ninja figure with multiple weapons and authentic martial arts poses.',
    inStock: true,
    stock: 18,
    colors: ['Black', 'Gray'],
    features: ['Multiple weapons', 'Stealth mode', 'Articulated joints'],
    brand: 'WarriorToys',
    ageGroup: '8+ years',
    weight: '180g',
    isActive: true,
    isFeatured: false,
    tags: ['ninja', 'warrior', 'stealth', 'martial-arts'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Dolls
  {
    id: 'princess-castle-playset',
    name: 'Princess Castle Playset',
    price: usdToInr(89.99),
    originalPrice: usdToInr(109.99),
    discountPercentage: 18,
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'dolls',
    categoryName: 'Dolls',
    rating: 4.7,
    reviewCount: 156,
    description: 'Magical princess castle with furnished rooms, princess doll, and royal accessories.',
    inStock: true,
    stock: 12,
    colors: ['Pink', 'Purple', 'White'],
    features: ['Multi-room castle', 'Princess doll included', 'Furniture set', 'Light-up tower'],
    brand: 'RoyalPlay',
    ageGroup: '3-8 years',
    weight: '1.5kg',
    isActive: true,
    isFeatured: true,
    tags: ['princess', 'castle', 'dollhouse', 'royal'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fashion-doll-collection',
    name: 'Fashion Doll Collection Set',
    price: usdToInr(34.99),
    originalPrice: usdToInr(39.99),
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1337386/pexels-photo-1337386.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'dolls',
    categoryName: 'Dolls',
    rating: 4.4,
    reviewCount: 92,
    description: 'Stylish fashion doll with interchangeable outfits and accessories for endless styling fun.',
    inStock: true,
    stock: 20,
    colors: ['Blonde', 'Brunette', 'Redhead'],
    features: ['Changeable outfits', 'Hair styling', 'Shoes collection', 'Handbag accessories'],
    brand: 'StyleDolls',
    ageGroup: '4-10 years',
    weight: '300g',
    isActive: true,
    isFeatured: false,
    tags: ['fashion', 'style', 'dress-up', 'accessories'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Educational
  {
    id: 'learning-tablet',
    name: 'Interactive Learning Tablet',
    price: usdToInr(49.99),
    originalPrice: usdToInr(59.99),
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'educational',
    categoryName: 'Educational',
    rating: 4.6,
    reviewCount: 203,
    description: 'Educational tablet with interactive games, ABC learning, numbers, and shapes for early development.',
    inStock: true,
    stock: 30,
    colors: ['Blue', 'Pink', 'Green'],
    features: ['50+ learning activities', 'Touch screen', 'Sound effects', 'Progressive difficulty'],
    brand: 'LearnTech',
    ageGroup: '3-6 years',
    weight: '400g',
    isActive: true,
    isFeatured: true,
    tags: ['educational', 'technology', 'learning', 'interactive'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'science-experiment-kit',
    name: 'Young Scientist Experiment Kit',
    price: usdToInr(42.99),
    originalPrice: usdToInr(49.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'educational',
    categoryName: 'Educational',
    rating: 4.5,
    reviewCount: 117,
    description: 'Complete science kit with 20+ safe experiments to explore chemistry, physics, and biology.',
    inStock: true,
    stock: 15,
    colors: ['Multi-color'],
    features: ['20+ experiments', 'Safety equipment', 'Instruction manual', 'Lab tools'],
    brand: 'ScienceKids',
    ageGroup: '8-14 years',
    weight: '800g',
    isActive: true,
    isFeatured: false,
    tags: ['science', 'experiments', 'chemistry', 'physics'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Building Blocks
  {
    id: 'building-blocks-set',
    name: 'Creative Building Blocks Set',
    price: usdToInr(34.99),
    originalPrice: usdToInr(39.99),
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'building',
    categoryName: 'Building Blocks',
    rating: 4.4,
    reviewCount: 178,
    description: '500-piece colorful building blocks set for endless creative construction possibilities.',
    inStock: true,
    stock: 22,
    colors: ['Multicolor'],
    features: ['500 pieces', 'Compatible blocks', 'Instruction booklet', 'Storage box'],
    brand: 'BuildMaster',
    ageGroup: '4-12 years',
    weight: '1.2kg',
    isActive: true,
    isFeatured: true,
    tags: ['building', 'construction', 'creativity', 'blocks'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'magnetic-building-tiles',
    name: 'Magnetic Building Tiles',
    price: usdToInr(56.99),
    originalPrice: usdToInr(64.99),
    discountPercentage: 12,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'building',
    categoryName: 'Building Blocks',
    rating: 4.7,
    reviewCount: 145,
    description: 'Magnetic tiles for 3D building with strong magnets and colorful transparent designs.',
    inStock: true,
    stock: 18,
    colors: ['Rainbow'],
    features: ['Strong magnets', 'Transparent tiles', '100 pieces', '3D building'],
    brand: 'MagnetPlay',
    ageGroup: '3-10 years',
    weight: '900g',
    isActive: true,
    isFeatured: false,
    tags: ['magnetic', 'tiles', '3d', 'transparent'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Vehicles
  {
    id: 'rc-race-car',
    name: 'Remote Control Race Car',
    price: usdToInr(59.99),
    originalPrice: usdToInr(69.99),
    discountPercentage: 14,
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'vehicles',
    categoryName: 'Vehicles',
    rating: 4.3,
    reviewCount: 234,
    description: 'High-speed remote control race car with LED lights, rechargeable battery and 2.4GHz controller.',
    inStock: true,
    stock: 16,
    colors: ['Red', 'Blue', 'Yellow'],
    features: ['2.4GHz remote', 'LED lights', 'Rechargeable battery', '15 mph speed'],
    brand: 'SpeedRacer',
    ageGroup: '8+ years',
    weight: '600g',
    isActive: true,
    isFeatured: true,
    tags: ['remote-control', 'racing', 'speed', 'led-lights'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'construction-truck-set',
    name: 'Construction Truck Playset',
    price: usdToInr(44.99),
    originalPrice: usdToInr(52.99),
    discountPercentage: 15,
    image: 'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'vehicles',
    categoryName: 'Vehicles',
    rating: 4.2,
    reviewCount: 98,
    description: 'Heavy-duty construction trucks with working parts, dump truck, crane, and bulldozer.',
    inStock: true,
    stock: 14,
    colors: ['Yellow', 'Orange'],
    features: ['Working parts', '3 vehicles', 'Realistic sounds', 'Durable construction'],
    brand: 'WorkTrucks',
    ageGroup: '3-8 years',
    weight: '1.1kg',
    isActive: true,
    isFeatured: false,
    tags: ['construction', 'trucks', 'working-parts', 'realistic'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Puzzles & Games
  {
    id: 'educational-puzzle-set',
    name: '1000 Piece Jigsaw Puzzle Set',
    price: usdToInr(24.99),
    originalPrice: usdToInr(29.99),
    discountPercentage: 17,
    image: 'https://images.pexels.com/photos/1314416/pexels-photo-1314416.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1314416/pexels-photo-1314416.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'puzzles',
    categoryName: 'Puzzles & Games',
    rating: 4.6,
    reviewCount: 167,
    description: 'Beautiful landscape puzzle with 1000 pieces for hours of challenging entertainment.',
    inStock: true,
    stock: 25,
    colors: ['Multicolor'],
    features: ['1000 pieces', 'High quality print', 'Poster included', 'Storage box'],
    brand: 'PuzzleMaster',
    ageGroup: '12+ years',
    weight: '700g',
    isActive: true,
    isFeatured: false,
    tags: ['puzzle', 'jigsaw', 'landscape', 'challenging'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Outdoor Toys
  {
    id: 'basketball-hoop-set',
    name: 'Adjustable Basketball Hoop',
    price: usdToInr(79.99),
    originalPrice: usdToInr(89.99),
    discountPercentage: 11,
    image: 'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'outdoor',
    categoryName: 'Outdoor Toys',
    rating: 4.4,
    reviewCount: 112,
    description: 'Height-adjustable basketball hoop with sturdy base and professional-grade rim.',
    inStock: true,
    stock: 8,
    colors: ['Blue', 'Red'],
    features: ['Height adjustable', 'Sturdy base', 'Basketball included', 'Easy assembly'],
    brand: 'SportKids',
    ageGroup: '6+ years',
    weight: '5kg',
    isActive: true,
    isFeatured: false,
    tags: ['basketball', 'sports', 'outdoor', 'adjustable'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Board Games
  {
    id: 'family-board-game',
    name: 'Adventure Quest Board Game',
    price: usdToInr(39.99),
    originalPrice: usdToInr(44.99),
    discountPercentage: 11,
    image: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'board-games',
    categoryName: 'Board Games',
    rating: 4.5,
    reviewCount: 134,
    description: 'Strategic adventure board game for 2-6 players with quest cards and treasure hunts.',
    inStock: true,
    stock: 20,
    colors: ['Multicolor'],
    features: ['2-6 players', 'Quest cards', 'Strategic gameplay', 'Family friendly'],
    brand: 'GameNight',
    ageGroup: '10+ years',
    weight: '1kg',
    isActive: true,
    isFeatured: false,
    tags: ['board-game', 'strategy', 'adventure', 'family'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Electronic Toys
  {
    id: 'robot-companion',
    name: 'Interactive Robot Companion',
    price: usdToInr(129.99),
    originalPrice: usdToInr(149.99),
    discountPercentage: 13,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    category: 'electronic',
    categoryName: 'Electronic Toys',
    rating: 4.7,
    reviewCount: 189,
    description: 'AI-powered robot companion with voice recognition, dancing, and educational games.',
    inStock: true,
    stock: 10,
    colors: ['White', 'Blue'],
    features: ['Voice recognition', 'Dancing modes', 'Educational games', 'App control'],
    brand: 'RoboTech',
    ageGroup: '8+ years',
    weight: '1.2kg',
    isActive: true,
    isFeatured: true,
    tags: ['robot', 'interactive', 'ai', 'educational'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Expanded Users data
const usersData = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@toyland.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543210',
    isActive: true,
    wishlist: [],
    compareList: [],
    addresses: [
      {
        type: 'home',
        firstName: 'Admin',
        lastName: 'User',
        addressLine1: '123 Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91-9876543210',
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'customer@toyland.com',
    password: 'customer123',
    role: 'customer',
    phone: '+91-9876543211',
    isActive: true,
    wishlist: ['superhero-action-figure', 'learning-tablet'],
    compareList: ['rc-race-car', 'robot-companion'],
    addresses: [
      {
        type: 'home',
        firstName: 'Rahul',
        lastName: 'Kumar',
        addressLine1: '456 Customer Lane',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91-9876543211',
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    password: 'priya123',
    role: 'customer',
    phone: '+91-9876543212',
    isActive: true,
    wishlist: ['princess-castle-playset', 'fashion-doll-collection'],
    compareList: ['building-blocks-set', 'magnetic-building-tiles'],
    addresses: [
      {
        type: 'home',
        firstName: 'Priya',
        lastName: 'Sharma',
        addressLine1: '789 Garden View',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        phone: '+91-9876543212',
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@example.com',
    password: 'amit123',
    role: 'customer',
    phone: '+91-9876543213',
    isActive: true,
    wishlist: ['science-experiment-kit', 'educational-puzzle-set'],
    compareList: ['learning-tablet', 'robot-companion'],
    addresses: [
      {
        type: 'home',
        firstName: 'Amit',
        lastName: 'Patel',
        addressLine1: '321 Tech Park',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        phone: '+91-9876543213',
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@example.com',
    password: 'sneha123',
    role: 'customer',
    phone: '+91-9876543214',
    isActive: true,
    wishlist: ['basketball-hoop-set', 'construction-truck-set'],
    compareList: ['rc-race-car', 'ninja-warrior-figure'],
    addresses: [
      {
        type: 'home',
        firstName: 'Sneha',
        lastName: 'Reddy',
        addressLine1: '654 Sports Complex',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        phone: '+91-9876543214',
        isDefault: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedFirestoreDatabase() {
  try {
    console.log('🔥 Starting expanded Firestore database seeding...');
    
    const db = getFirestoreDB();
    
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    
    // Clear categories
    const categoriesRef = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesRef);
    for (const docSnapshot of categorySnapshot.docs) {
      await deleteDoc(doc(db, 'categories', docSnapshot.id));
    }
    
    // Clear products
    const productsRef = collection(db, 'products');
    const productSnapshot = await getDocs(productsRef);
    for (const docSnapshot of productSnapshot.docs) {
      await deleteDoc(doc(db, 'products', docSnapshot.id));
    }
    
    // Clear users
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersRef);
    for (const docSnapshot of userSnapshot.docs) {
      await deleteDoc(doc(db, 'users', docSnapshot.id));
    }

    console.log('✅ Existing data cleared!');

    // Seed categories
    console.log('📁 Seeding categories...');
    for (const category of categoriesData) {
      const categoryRef = doc(db, 'categories', category.id);
      await setDoc(categoryRef, category);
    }
    console.log(`✅ Added ${categoriesData.length} categories to Firestore`);

    // Seed products
    console.log('📦 Seeding products...');
    for (const product of productsData) {
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, product);
    }
    console.log(`✅ Added ${productsData.length} products to Firestore`);

    // Seed users (hash passwords first)
    console.log('👥 Seeding users...');
    const bcrypt = require('bcryptjs');
    
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const userWithHashedPassword = {
        ...userData,
        password: hashedPassword
      };
      
      const usersRef = collection(db, 'users');
      const userRef = doc(usersRef);
      userWithHashedPassword.id = userRef.id;
      await setDoc(userRef, userWithHashedPassword);
    }
    console.log(`✅ Added ${usersData.length} users to Firestore`);

    console.log('\n🎉 Expanded Firestore database seeded successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📁 Categories: ${categoriesData.length}`);
    console.log(`📦 Products: ${productsData.length} (All with INR pricing)`);
    console.log(`👥 Users: ${usersData.length}`);
    console.log('═══════════════════════════════════════════════');
    console.log('🔑 Test Accounts:');
    console.log('   👤 Admin: admin@toyland.com / admin123');
    console.log('   👤 Customer: customer@toyland.com / customer123');
    console.log('   👤 Priya: priya.sharma@example.com / priya123');
    console.log('   👤 Amit: amit.patel@example.com / amit123');
    console.log('   👤 Sneha: sneha.reddy@example.com / sneha123');
    console.log('═══════════════════════════════════════════════');
    console.log('💰 Sample Products with INR Pricing:');
    console.log('   🦸 Super Hero Action Figure: ₹2,074');
    console.log('   👸 Princess Castle Playset: ₹7,469');
    console.log('   📱 Interactive Learning Tablet: ₹4,149');
    console.log('   🧱 Building Blocks Set: ₹2,904');
    console.log('   🚗 RC Race Car: ₹4,979');
    console.log('   🤖 Interactive Robot Companion: ₹10,787');
    console.log('   🏀 Basketball Hoop: ₹6,639');
    console.log('   🔬 Science Experiment Kit: ₹3,568');
    console.log('═══════════════════════════════════════════════');
    console.log('🔥 Database: Firebase Firestore (toyshop-3779d)');
    console.log('✅ Your expanded Firebase database is ready!');
    console.log('🚀 You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Initialize Firebase and seed database
async function initialize() {
  try {
    console.log('🔥 Firebase initialized successfully');
    await seedFirestoreDatabase();
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initialize();
