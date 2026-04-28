# 🔧 Error Recovery & Troubleshooting Guide

## Quick Reference

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| Build fails in GitHub Actions | Syntax/dependency error | Check logs, run locally, fix and push |
| Deployment hangs | Netlify serverless timeout | Check function logs, optimize code |
| API returns 404 | Routes not found | Verify netlify.toml redirects |
| Database connection error | Invalid DATABASE_URL | Check Supabase connection pooler |
| Health check fails | API not responding | Check Netlify function logs |
| Users can't login | JWT verification fails | Verify JWT_SECRET matches |
| Results show empty | Database query fails | Test database connection |
| Email not sending | SMTP configuration issue | Check email credentials, logs |

---

## 🔴 Critical Issues & Solutions

### 1. Deployment Completely Failed

**Symptoms:**
- GitHub Actions shows red X on workflow
- Deployment not visible in Netlify

**Recovery Steps:**

```bash
# Step 1: Check what went wrong
# Go to GitHub → Actions → Latest workflow → Click failed step

# Step 2: Identify the error
# Common patterns:
# - "Cannot find module" → Missing dependency
# - "Build command failed" → Syntax error
# - "Netlify API error" → Token/permissions issue

# Step 3: Fix locally
npm install
npm run build  # Should succeed without errors

# Step 4: Verify fixes
git status
git add .
git commit -m "Fix deployment error: [describe issue]"
git push origin main

# Step 5: Monitor GitHub Actions
# Go to Actions tab and watch the new workflow run
```

### 2. Database Connection Lost

**Symptoms:**
- Health check returns database error
- Login fails with "Database error"
- API endpoints return 500

**Recovery Steps:**

```bash
# Step 1: Test connection locally
psql $DATABASE_URL -c "SELECT 1 as connection_test"
# Should return: connection_test | 1

# Step 2: Verify Supabase is running
# Go to https://supabase.com → Your Project → Status

# Step 3: Check DATABASE_URL in Netlify
# Netlify → Site settings → Build & deploy → Environment
# Verify DATABASE_URL is correct

# Step 4: Update URL if needed
# Go to Supabase → Settings → Database → Connection Pooler
# Copy new connection string
# Update in Netlify environment variables

# Step 5: Redeploy
git commit --allow-empty -m "Trigger redeploy with new database config"
git push origin main
```

### 3. API Endpoints Return 500

**Symptoms:**
- Frontend shows "Server Error"
- Health check fails
- All API calls return 500

**Recovery Steps:**

```bash
# Step 1: Check Netlify function logs
netlify logs --functions

# OR via dashboard:
# Netlify → Your Site → Functions → api → Logs

# Step 2: Look for error patterns
# - "Cannot find module" → Missing dependency
# - "Connection timeout" → Database issue
# - "undefined is not a function" → Code error

# Step 3: Review recent changes
git log --oneline -5

# Step 4: Rollback if needed
git revert HEAD  # Revert last commit
git push origin main

# Step 5: Monitor deployment
# Check GitHub Actions and Netlify logs
```

### 4. Frontend Not Loading

**Symptoms:**
- Browser shows "404 Not Found"
- Netlify shows site offline
- CSS/JS not loading

**Recovery Steps:**

```bash
# Step 1: Check build output
# GitHub Actions → Latest workflow → Build step

# Step 2: Verify build locally
npm --prefix frontend-react run build
# Check if dist folder created with files

# Step 3: Check netlify.toml
# Verify publish directory is "frontend-react/dist"

# Step 4: Verify frontend-react/dist exists
ls -la frontend-react/dist
# Should show index.html and assets

# Step 5: Force rebuild
git commit --allow-empty -m "Trigger rebuild"
git push origin main
```

---

## 🟡 Performance Issues

### Cold Starts Too Slow

**Symptoms:**
- First request takes 10+ seconds
- Subsequent requests fast
- Users complain about slowness

**Solutions:**

1. **Use Netlify Pro** (faster cold starts)
2. **Optimize function code:**
   ```javascript
   // Load heavy modules only when needed
   let db = null;
   function getDB() {
     if (!db) {
       db = require('./db');
     }
     return db;
   }
   ```

3. **Reduce bundle size:**
   ```bash
   npm --prefix frontend-react run build -- --analyze
   ```

4. **Enable caching:**
   Update `netlify.toml`:
   ```toml
   [build.cache]
     npm = true
   ```

### Memory Issues

**Symptoms:**
- Netlify shows "Out of memory"
- Deployment fails with OOM
- Functions timeout

**Solutions:**

```javascript
// Limit data processing
const BATCH_SIZE = 100;
for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE);
  await processBlock(batch);
}

// Clear unused data
let largeArray = null;
// ... use largeArray ...
largeArray = null; // Clear for garbage collection
```

---

## 🟠 Configuration Issues

### Environment Variables Not Working

**Symptoms:**
- API says "Missing DATABASE_URL"
- "JWT_SECRET not found"
- Environment validation fails

**Diagnosis & Fix:**

```bash
# Step 1: Verify variables are set in Netlify
# Netlify → Site settings → Build & deploy → Environment
# Should see all variables listed

# Step 2: Check GitHub secrets (for CI/CD)
# GitHub → Settings → Secrets and variables → Actions
# Should see all secrets listed

# Step 3: Verify variable names (case-sensitive!)
# ✓ DATABASE_URL (correct)
# ✗ database_url (wrong)
# ✗ Database_Url (wrong)

# Step 4: Redeploy after changes
git commit --allow-empty -m "Redeploy with env vars"
git push origin main

# Step 5: Verify in health check
curl https://YOUR_SITE.netlify.app/.netlify/functions/api/health/detailed
```

### CORS/Authentication Issues

**Symptoms:**
- Frontend shows "CORS error"
- "Unauthorized" on valid requests
- Token not working

**Fix CORS:**

```javascript
// In backend/server.js, verify CORS config:
const corsOptions = {
  origin: [
    'https://YOUR_SITE.netlify.app',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

**Fix Authentication:**

```javascript
// Verify JWT_SECRET matches everywhere:
// 1. Netlify environment variable
// 2. GitHub secret
// 3. Used in both encoding and decoding

// Test token manually
const token = jwt.sign({id: 1}, process.env.JWT_SECRET);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 🟢 Monitoring & Prevention

### Set Up Alerts

**GitHub Actions Notifications:**
1. GitHub → Repository → Settings → Notifications
2. Enable failed workflow notifications
3. Get email on deployment failure

**Netlify Notifications:**
1. Netlify Dashboard → Site settings → Notifications
2. Enable "Deploy notifications"
3. Get email/Slack on deploy failures

### Daily Health Check

```bash
#!/bin/bash
# Check deployment health daily

SITE_URL="https://YOUR_SITE.netlify.app"

# Basic health
curl -s "$SITE_URL/.netlify/functions/api/health" | jq .

# Detailed health with database
curl -s "$SITE_URL/.netlify/functions/api/health/detailed" | jq .
```

### Automated Backups

**Schedule database backups:**

```bash
# Add to cron (daily at 2 AM)
0 2 * * * pg_dump $DATABASE_URL > ~/backups/db_backup_$(date +\%Y\%m\%d).sql
```

---

## 🔄 Rollback Procedures

### Quick Rollback (1 Minute)

**Via Netlify Dashboard:**
1. Netlify → Your Site → Deploys
2. Find last successful deployment
3. Click "..." → "Publish deploy"
4. Refresh site to verify

**Command line:**
```bash
# List deployments
netlify deploy:list --site YOUR_SITE_ID

# Rollback to specific deployment
netlify deploy:restore DEPLOYMENT_ID
```

### Rollback via Git (If needed)

```bash
# Revert last commit
git revert HEAD
git push origin main

# This creates a NEW commit that undoes changes
# GitHub Actions will deploy the revert

# To rollback multiple commits
git revert HEAD~2..HEAD
git push origin main
```

### Database Rollback

```bash
# If schema changes broke things:

# 1. Check backup exists
ls -la ~/backups/db_backup_*.sql

# 2. Restore from backup (⚠️ WARNING: This overwrites current data)
psql $DATABASE_URL < ~/backups/db_backup_20240428.sql

# 3. Verify data restored
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## 📋 Error Recovery Checklist

### When Deployment Fails:

- [ ] Check GitHub Actions logs
- [ ] Run build locally: `npm run build`
- [ ] Fix any errors found
- [ ] Commit and push: `git push origin main`
- [ ] Monitor new deployment
- [ ] If still fails, rollback
- [ ] Check Netlify function logs
- [ ] Verify all secrets set

### When API Fails:

- [ ] Check health endpoint: `curl .../api/health`
- [ ] Check function logs: `netlify logs --functions`
- [ ] Verify DATABASE_URL connection
- [ ] Check JWT_SECRET is set
- [ ] Test locally: `npm --prefix backend install && npm --prefix backend test`
- [ ] If fails, rollback to last working version

### When Database Fails:

- [ ] Verify Supabase is running
- [ ] Test connection: `psql $DATABASE_URL -c "SELECT 1"`
- [ ] Check DATABASE_URL in environment
- [ ] Verify connection pooler enabled
- [ ] If corrupted, restore from backup

---

## 🆘 When All Else Fails

### Nuclear Option: Full Reset

```bash
# 1. Reset to last known good commit
git log --oneline | head -5  # Find good commit
git reset --hard COMMIT_HASH
git push origin main --force

# 2. Clear Netlify cache
netlify build --debug

# 3. Deploy from clean state
git commit --allow-empty -m "Full reset deployment"
git push origin main

# 4. Monitor carefully
# Check Actions and Netlify dashboards
```

### Get Help

1. **Check logs first:**
   - GitHub Actions: Actions → Latest Workflow → Failed step
   - Netlify: Dashboard → Functions → api → Logs
   - Backend: `npm --prefix backend start` locally

2. **Test locally:**
   ```bash
   npm install
   npm --prefix backend install
   npm --prefix frontend-react install
   npm run build
   # Should complete without errors
   ```

3. **Common resources:**
   - Netlify Docs: https://docs.netlify.com
   - GitHub Actions: https://docs.github.com/actions
   - Node.js: https://nodejs.org/docs
   - Express.js: https://expressjs.com
   - Sequelize: https://sequelize.org

---

## 📞 Support Commands

```bash
# Check Node version
node --version
# Should be v22.x

# Check npm version
npm --version

# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# View build logs
cat ~/.netlify/cache/build.log

# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build

# View GitHub Actions logs
gh run list --repo YOUR_OWNER/YOUR_REPO

# Check Netlify status
netlify status
```

---

**Remember**: 
- ✅ Backups prevent data loss
- ✅ Rollbacks fix bad deployments
- ✅ Logs tell you what went wrong
- ✅ Test locally before pushing
- ✅ One-click rollback always available
