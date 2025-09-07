# Deployment Instructions

## Frontend Deployment on Vercel

### Method 1: Using Git Repository (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Root Directory**: `frontend` (IMPORTANT: Set this to frontend folder)
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build` (default)
     - **Output Directory**: `dist` (default)
     - **Install Command**: `npm install` (default)

3. **Environment Variables on Vercel**:
   - In your Vercel project dashboard, go to "Settings" → "Environment Variables"
   - Add these variables:
     ```
     VITE_API_URL=https://your-backend-app.onrender.com/api
     VITE_APP_NAME=Kids Toys Ecommerce
     VITE_APP_VERSION=1.0.0
     VITE_DEV_MODE=false
     VITE_DEBUG=false
     VITE_IMAGE_QUALITY=85
     VITE_LAZY_LOADING=true
     VITE_CACHE_TTL=300000
     VITE_PAGINATION_LIMIT=12
     VITE_ENABLE_INFINITE_SCROLL=true
     VITE_ENABLE_VIRTUAL_SCROLLING=false
     VITE_ENABLE_SERVICE_WORKER=true
     ```

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

## Backend Deployment on Render

### Method 1: Using Git Repository (Recommended)

1. **Push your code to GitHub** (same as above)

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: toy-website-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Region**: Oregon (US West)
     - **Branch**: main
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Environment Variables on Render**:
   - In your Render service dashboard, go to "Environment"
   - Add all the variables from `.env.example`:
     ```
     NODE_ENV=production
     PORT=10000
     FRONTEND_URL=https://your-vercel-app.vercel.app
     JWT_SECRET=your-super-secret-jwt-key
     JWT_EXPIRE=30d
     
     # Firebase Configuration
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_PRIVATE_KEY_ID=your-private-key-id
     FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
     FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
     FIREBASE_CLIENT_ID=your-client-id
     FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
     FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
     FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
     FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
     
     # Add other optional variables as needed
     ```

### Method 2: Using Render Blueprint

1. Use the `render.yaml` file in the root directory
2. In Render, select "Blueprint" and connect your repository

## Post-Deployment Steps

1. **Update Frontend API URL**:
   - After backend is deployed on Render, copy the service URL
   - Update the `VITE_API_URL` in Vercel environment variables
   - Redeploy the frontend

2. **Test the Application**:
   - Visit your Vercel frontend URL
   - Test API endpoints
   - Check browser console for any errors

3. **Domain Configuration** (Optional):
   - Configure custom domain in Vercel
   - Configure custom domain in Render
   - Update CORS origins in backend

## Troubleshooting

### Common Issues:

1. **404 NOT_FOUND on Vercel**:
   - Ensure Root Directory is set to `frontend` in Vercel project settings
   - Check if `vercel.json` exists in the frontend folder
   - Verify build command and output directory
   - Check if `index.html` exists in the dist folder after build

2. **Permission Denied Error (Command exited with 126)**:
   - This occurs when root directory is not set correctly
   - Make sure to set Root Directory to `frontend` in Vercel project settings
   - Do not use custom build commands like `cd frontend && npm run build`

3. **CORS Error**:
   - Update `FRONTEND_URL` environment variable in Render
   - Check CORS configuration in `server.js`

3. **Build Failures**:
   - Check build logs in Vercel/Render
   - Verify all dependencies are listed in `package.json`
   - Check Node.js version compatibility

4. **Environment Variables Not Working**:
   - Ensure all VITE_ prefixed variables are set in Vercel
   - Ensure backend environment variables are set in Render
   - Redeploy after adding environment variables

## Health Checks

- **Frontend**: Visit your Vercel URL
- **Backend**: Visit `https://your-backend-app.onrender.com/api/health`
