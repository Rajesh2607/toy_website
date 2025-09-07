# Alternative Vercel Setup

If the settings update doesn't work, try this approach:

## Method 1: Create New Vercel Project

1. **Delete current project**:
   - Go to Settings → General → scroll down
   - Click "Delete Project"

2. **Create new project**:
   - Go to vercel.com/new
   - Import from GitHub: `Rajesh2607/toy_website`
   - **IMPORTANT**: Set Root Directory to `frontend` during setup
   - Keep other settings as default

## Method 2: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Deploy from frontend folder
vercel

# Follow the prompts
```

## Method 3: Manual Package.json Fix

Add this to your root `package.json`:

```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "start": "cd frontend && npm run preview"
  }
}
```

But the **Root Directory** setting is the proper solution.
