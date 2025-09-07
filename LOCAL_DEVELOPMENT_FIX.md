# Local Development Setup - BOTH ISSUES FIXED

## Problem Identified
- ❌ **Backend**: Missing `.env` file (Firebase configuration needed)
- ❌ **Frontend**: No development environment configuration
- ❌ **Backend**: Not running locally

## Quick Fix for Local Development

### Option 1: Use Production Backend (Fastest)
Since the production backend is working, you can develop frontend against it:

1. **Frontend is already configured** with `.env.local` to use localhost backend
2. **Update it to use production backend temporarily**:

```bash
# In frontend/.env.local
VITE_API_URL=https://toy-website-backend.onrender.com/api
```

### Option 2: Full Local Setup (Complete)

#### Step 1: Setup Backend Environment
1. **Copy the environment template**:
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **You need Firebase credentials** - without them, the backend won't work
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Update the `.env` file with your Firebase credentials

#### Step 2: Start Backend
```bash
cd backend
npm run dev
```

#### Step 3: Start Frontend
```bash
cd frontend  
npm run dev
```

## Immediate Testing Solutions

### Test 1: Frontend with Production Backend
```bash
cd frontend
# Edit .env.local to use production API
npm run dev
```

### Test 2: Check if Backend Starts Locally
```bash
cd backend
npm run dev
# If it fails, you need Firebase configuration
```

### Test 3: Verify API Connection
Open: http://localhost:3000 (after running `npm run dev` in frontend)

## Firebase Setup Required for Local Backend

To run the backend locally, you need:

1. **Firebase Project** (free tier available)
2. **Service Account Key** (JSON file)
3. **Environment variables** set in backend/.env

### Get Firebase Credentials:
1. Go to https://console.firebase.google.com
2. Select your project (or create new)
3. Project Settings → Service Accounts
4. Generate new private key → Download JSON
5. Extract the values and put in backend/.env

## Current Status

### ✅ Working Right Now:
- Production Backend: `https://toy-website-backend.onrender.com/api`
- You can develop frontend using production backend

### ❌ Needs Setup:
- Local backend (requires Firebase credentials)
- Production frontend deployment (needs Vercel environment variables)

## Recommended Next Steps

1. **Immediate**: Use production backend for frontend development
2. **Later**: Set up Firebase for complete local development
3. **Deploy**: Fix Vercel environment variables for production

## Quick Commands to Get Started

```bash
# Terminal 1: Frontend development (using production backend)
cd frontend
npm run dev
# Opens http://localhost:3000

# Test the connection
# Browser: http://localhost:3000/api-test.html
```

This will get your frontend working immediately while you can set up local backend later if needed.
