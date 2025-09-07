#!/bin/bash

# Vercel Deployment Verification Script
echo "🚀 Vercel Deployment Verification for Kids Toys Ecommerce"
echo "========================================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo ""

# Check package.json
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    
    # Check for required scripts
    if grep -q '"build"' package.json; then
        echo "✅ Build script configured"
    else
        echo "❌ Build script missing"
    fi
else
    echo "❌ package.json not found"
fi

# Check vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json configured"
else
    echo "⚠️  vercel.json not found (optional but recommended)"
fi

# Check index.html
if [ -f "index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
fi

# Check src directory
if [ -d "src" ]; then
    echo "✅ src directory found"
    
    if [ -f "src/main.jsx" ]; then
        echo "✅ main.jsx entry point found"
    else
        echo "❌ main.jsx entry point missing"
    fi
else
    echo "❌ src directory missing"
fi

# Test build process
echo ""
echo "🏗️  Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        echo "✅ dist directory created"
        
        # Check dist contents
        if [ -f "dist/index.html" ]; then
            echo "✅ dist/index.html generated"
        else
            echo "❌ dist/index.html missing"
        fi
        
        # Check for assets
        if [ -d "dist/assets" ]; then
            echo "✅ Assets directory created"
        else
            echo "⚠️  No assets directory found"
        fi
    else
        echo "❌ dist directory not created"
    fi
else
    echo "❌ Build failed!"
    echo "Check the error messages above for details"
    exit 1
fi

echo ""
echo "📊 Deployment Readiness Summary:"
echo "================================"

# Environment variables check
echo ""
echo "🔧 Environment Variables Needed in Vercel Dashboard:"
echo "VITE_API_URL = https://toy-website-backend.onrender.com/api"
echo "VITE_APP_NAME = Kids Toys Ecommerce"
echo "VITE_DEV_MODE = false"
echo "VITE_DEBUG = false"

echo ""
echo "⚙️  Vercel Project Settings:"
echo "Framework: Vite"
echo "Root Directory: frontend (if deploying from repo root)"
echo "Build Command: npm run build"
echo "Output Directory: dist"
echo "Install Command: npm install"
echo "Node.js Version: 18.x"

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Import your GitHub repository"
echo "3. Set root directory to 'frontend' (if deploying from repo root)"
echo "4. Add the environment variables listed above"
echo "5. Deploy!"

echo ""
echo "🎉 Your frontend is ready for Vercel deployment!"
echo ""
echo "📝 If deployment fails, check VERCEL_DEPLOYMENT_ERROR_FIX.md for troubleshooting"
