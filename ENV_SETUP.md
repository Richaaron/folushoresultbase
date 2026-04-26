# Environment Variables Setup Guide

## 🔴 IMPORTANT: Set Environment Variables in Vercel

Your deployment is failing because `DATABASE_URL` and other variables are not set in Vercel.

### Step 1: Update Local `.env.local` (for testing)

**backend/.env.local:**
```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_REGION].supabase.co:5432/postgres
JWT_SECRET=your-secure-random-string-here-at-least-32-chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**frontend-react/.env.local:**
```
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **Database**
4. Copy the connection string under **Connection Pooler** or **Direct Connection**
   - **Connection Pooler** (recommended for serverless): Use this format
   - Format: `postgresql://postgres:[PASSWORD]@db.[REGION].supabase.co:5432/postgres`

**Example:**
```
postgresql://postgres:abc123xyz@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

### Step 3: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Result Software** project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your Supabase connection string | `postgresql://postgres:abc123@db.xxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | A secure 32+ character string | Generate: Use a password generator or `openssl rand -base64 32` |
| `FRONTEND_URL` | Your Vercel deployed URL | `https://resultsoftware.vercel.app` |
| `NODE_ENV` | Set to `production` | `production` |

5. Make sure **Environment** is set to:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

6. Click **Save**

### Step 4: Redeploy on Vercel

1. Go to **Deployments** tab
2. Click the three dots on your latest deployment
3. Select **Redeploy**
4. Wait for build to complete

### Step 5: Test the Connection

Once deployed, try logging in at your Vercel URL:
- **Admin Username:** `admin`
- **Admin Password:** `admin123`

If you get logged in, the database connection is working! ✅

---

## 🔧 Troubleshooting

### "invalid username and password"
- ❌ DATABASE_URL not set in Vercel
- ✅ Set it in Project Settings → Environment Variables

### "ECONNREFUSED 127.0.0.1:5432"
- Connection string has wrong host
- Verify you're using `db.[region].supabase.co` not `localhost`

### "No database tables found"
- Database is connected but empty
- Run the seed data (happens on first backend startup)
- Check Vercel logs for errors

### Still failing?
1. Check Vercel deployment logs for exact error message
2. Verify DATABASE_URL format is correct
3. Test with local `.env.local` first
4. Ask Supabase support if connection pooler isn't working

