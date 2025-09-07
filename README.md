# 🧸 Kids Toys Ecommerce Website

A full-stack ecommerce website for kids' toys built with React, Node.js, Express, and Firebase.

## 🌟 Features

### 🛍️ Shopping Experience
- Browse toys by categories (Action Figures, Educational Toys, Board Games, etc.)
- Product search and filtering
- Detailed product pages with images and descriptions
- Shopping cart functionality
- Wishlist for favorite items
- Product comparison feature

### 👤 User Management
- User registration and authentication
- User profiles and order history
- Secure JWT-based authentication

### 🛒 Order Management
- Checkout process
- Order tracking
- Email notifications for orders
- Order success confirmation

### 🎨 UI/UX
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Optimized images with lazy loading
- Dark/light mode support

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Headless UI** - Unstyled accessible UI components
- **Heroicons** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase** - Database and authentication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Database
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Storage** - File storage for images

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Firebase project (for database)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajesh2607/toy_website.git
   cd toy_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Environment Setup**
   
   **Backend Environment** (`backend/.env`):
   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Frontend Environment** (`frontend/.env.local`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Kids Toys Ecommerce
   VITE_DEV_MODE=true
   VITE_DEBUG=true
   ```

4. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Add your web app configuration to the environment variables
   - Set up Firebase Admin SDK for backend

5. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run start:all
   
   # Or start individually
   npm run start:backend  # Backend on http://localhost:5000
   npm run start:frontend # Frontend on http://localhost:3000
   ```

## 📁 Project Structure

```
toy_website/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── scripts/           # Database seeding scripts
│   ├── package.json
│   └── server.js
│
├── package.json            # Root package.json with scripts
├── render.yaml            # Render deployment configuration
└── README.md             # This file
```

## 🔧 Available Scripts

### Root Level Scripts
```bash
npm run start:all          # Start both frontend and backend
npm run start:frontend     # Start frontend development server
npm run start:backend      # Start backend development server
npm run build:frontend     # Build frontend for production
npm run deploy:all         # Deploy both frontend and backend
```

### Frontend Scripts
```bash
cd frontend
npm run dev               # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint            # Run ESLint
```

### Backend Scripts
```bash
cd backend
npm run dev             # Start with nodemon
npm start              # Start production server
npm run seed           # Seed database with sample data
```

## 🌐 Deployment

### Frontend (Vercel)
1. **Connect GitHub repository to Vercel**
2. **Set root directory to `frontend`**
3. **Add environment variables in Vercel dashboard:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=Kids Toys Ecommerce
   VITE_DEV_MODE=false
   ```
4. **Deploy automatically on push**

### Backend (Render)
1. **Connect GitHub repository to Render**
2. **Use the included `render.yaml` configuration**
3. **Add sensitive environment variables in Render dashboard**
4. **Deploy automatically on push**

## 🧪 Testing

### API Testing
Visit `/api-test.html` on your deployed frontend to test API connectivity.

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Browse products and categories
- [ ] Add/remove items from cart
- [ ] Complete checkout process
- [ ] View order history
- [ ] Wishlist functionality
- [ ] Product search and filters

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet security headers
- Input validation and sanitization

## 📱 Responsive Design

The website is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎯 Performance Optimizations

- Lazy loading for images
- Code splitting with React Router
- Optimized bundle sizes with Vite
- Caching strategies
- Compressed images
- Minified CSS and JavaScript

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Check if backend is running
   - Verify API URL in environment variables
   - Check CORS configuration

2. **Firebase connection issues**
   - Verify Firebase configuration
   - Check Firestore rules
   - Ensure proper authentication setup

3. **Build failures**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all environment variables are set

### Getting Help
- Check the browser console for errors
- Review network tab in developer tools
- Verify environment variables are properly set
- Ensure all dependencies are installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rajesh** - [Rajesh2607](https://github.com/Rajesh2607)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase team for the backend services
- Tailwind CSS team for the styling framework
- All contributors and testers

---

⭐ **Don't forget to star this repository if you found it helpful!**
