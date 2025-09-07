#!/bin/bash

# Deployment Preparation Script
echo "🚀 Preparing deployment for Kids Toys Ecommerce..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo "❌ Please run this script from the root project directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

# Build frontend for production
echo "🏗️ Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check environment files
cd ..
echo "🔍 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️ WARNING: backend/.env file not found!"
    echo "📝 Please create backend/.env from backend/.env.example"
fi

if [ ! -f "frontend/.env.production" ]; then
    echo "⚠️ WARNING: frontend/.env.production file not found!"
else
    echo "✅ Frontend production environment configured"
fi

echo ""
echo "🎯 DEPLOYMENT CHECKLIST:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Frontend built successfully"
echo "3. ✅ Configuration files updated"
echo ""
echo "📋 NEXT STEPS:"
echo "1. 🔐 Set up Firebase Admin SDK credentials"
echo "2. 🔐 Set up Gmail App Password"
echo "3. 🚀 Push code to GitHub"
echo "4. 🌐 Deploy on Render (backend) and Vercel (frontend)"
echo ""
echo "📚 See DEPLOYMENT_COMPLETE_FIX.md for detailed instructions"
echo ""
echo "🎉 Ready for deployment!"
