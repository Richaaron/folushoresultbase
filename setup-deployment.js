#!/usr/bin/env node

/**
 * Netlify Deployment Setup Helper
 * This script helps you configure GitHub secrets and Netlify environment variables
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupDeployment() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🚀 Result Management System - Netlify Deployment Setup');
  console.log('═══════════════════════════════════════════════════════════\n');

  const config = {};

  // Step 1: Netlify Credentials
  console.log('📝 STEP 1: Netlify Credentials\n');
  console.log('1. Go to: https://app.netlify.com');
  console.log('2. Click Profile → User settings → Applications → Access tokens');
  console.log('3. Create a "Personal access token" and copy it\n');
  
  config.netlifyAuthToken = await question('Paste your Netlify Auth Token: ');

  console.log('\n4. Go to: https://app.netlify.com → Sites → Your Site');
  console.log('5. Site settings → General → Copy the Site ID\n');
  
  config.netlifySiteId = await question('Paste your Netlify Site ID: ');

  console.log('\n6. Your Netlify site URL should look like: https://SITE-NAME.netlify.app');
  console.log('   (Extract the site name, e.g., "resultsoftware")\n');
  
  config.netlifySiteName = await question('Paste your Netlify Site Name: ');

  // Step 2: Database
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 STEP 2: Database Configuration\n');
  console.log('1. Go to: https://supabase.com → Select your project');
  console.log('2. Go to Settings → Database → Connection pooler');
  console.log('3. Copy the "Connection string" (make sure URI mode is selected)\n');
  
  config.databaseUrl = await question('Paste your Supabase Connection String: ');

  // Step 3: JWT Secret
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 STEP 3: JWT Secret\n');
  console.log('Generating secure JWT Secret...\n');

  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('base64');
  console.log('Generated JWT Secret:');
  console.log(`  ${jwtSecret}\n`);
  console.log('⚠️  KEEP THIS SECRET! Never share it!\n');

  config.jwtSecret = jwtSecret;

  // Step 4: Frontend URL
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 STEP 4: Frontend URL\n');
  
  config.frontendUrl = `https://${config.netlifySiteName}.netlify.app`;
  console.log(`Detected Frontend URL: ${config.frontendUrl}\n`);
  
  let confirm = await question('Is this correct? (yes/no): ');
  if (confirm.toLowerCase() === 'no') {
    config.frontendUrl = await question('Enter your Frontend URL: ');
  }

  // Step 5: Summary
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ CONFIGURATION SUMMARY\n');
  console.log('GitHub Secrets to Add:');
  console.log('  NETLIFY_AUTH_TOKEN: ' + (config.netlifyAuthToken ? '✓ Set' : '✗ Not set'));
  console.log('  NETLIFY_SITE_ID: ' + (config.netlifySiteId ? '✓ Set' : '✗ Not set'));
  console.log('  NETLIFY_SITE_NAME: ' + (config.netlifySiteName ? '✓ Set' : '✗ Not set'));
  console.log('  DATABASE_URL: ' + (config.databaseUrl ? '✓ Set' : '✗ Not set'));
  console.log('  JWT_SECRET: ' + (config.jwtSecret ? '✓ Generated' : '✗ Not set'));
  console.log('\nNetlify Environment Variables:');
  console.log('  DATABASE_URL: ' + (config.databaseUrl ? '✓ Set' : '✗ Not set'));
  console.log('  JWT_SECRET: ' + (config.jwtSecret ? '✓ Generated' : '✗ Not set'));
  console.log('  FRONTEND_URL: ' + (config.frontendUrl ? '✓ Set' : '✗ Not set'));

  // Step 6: Instructions
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔧 NEXT STEPS:\n');

  console.log('1️⃣  Add GitHub Secrets:');
  console.log('   a) Go to: GitHub → Your Repository → Settings → Secrets and variables → Actions');
  console.log('   b) Click "New repository secret" and add:\n');
  
  console.log('   Name: NETLIFY_AUTH_TOKEN');
  console.log(`   Value: ${config.netlifyAuthToken}\n`);
  
  console.log('   Name: NETLIFY_SITE_ID');
  console.log(`   Value: ${config.netlifySiteId}\n`);
  
  console.log('   Name: NETLIFY_SITE_NAME');
  console.log(`   Value: ${config.netlifySiteName}\n`);
  
  console.log('   Name: DATABASE_URL');
  console.log(`   Value: ${config.databaseUrl}\n`);
  
  console.log('   Name: JWT_SECRET');
  console.log(`   Value: ${config.jwtSecret}\n`);

  console.log('2️⃣  Add Netlify Environment Variables:');
  console.log('   a) Go to: Netlify Dashboard → Your Site → Site settings → Build & deploy → Environment');
  console.log('   b) Add these variables:\n');
  
  console.log('   DATABASE_URL:');
  console.log(`   ${config.databaseUrl}\n`);
  
  console.log('   JWT_SECRET:');
  console.log(`   ${config.jwtSecret}\n`);
  
  console.log('   FRONTEND_URL:');
  console.log(`   ${config.frontendUrl}\n`);

  console.log('3️⃣  Deploy:');
  console.log('   a) Push to your main branch');
  console.log('   b) GitHub Actions will automatically deploy');
  console.log('   c) Check GitHub Actions tab for progress\n');

  console.log('4️⃣  Verify Deployment:');
  console.log(`   a) Visit: ${config.frontendUrl}`);
  console.log(`   b) Check health: ${config.frontendUrl}/.netlify/functions/api/health`);
  console.log('   c) Try logging in with admin/admin123\n');

  // Optional: Save to file
  console.log('═══════════════════════════════════════════════════════════');
  let saveToFile = await question('\n📁 Save configuration to file? (yes/no): ');
  
  if (saveToFile.toLowerCase() === 'yes') {
    const configFile = path.join(process.cwd(), 'DEPLOYMENT_CONFIG.txt');
    const content = `
Netlify Deployment Configuration
Generated: ${new Date().toISOString()}

GitHub Secrets:
  NETLIFY_AUTH_TOKEN=${config.netlifyAuthToken}
  NETLIFY_SITE_ID=${config.netlifySiteId}
  NETLIFY_SITE_NAME=${config.netlifySiteName}
  DATABASE_URL=${config.databaseUrl}
  JWT_SECRET=${config.jwtSecret}

Netlify Environment Variables:
  DATABASE_URL=${config.databaseUrl}
  JWT_SECRET=${config.jwtSecret}
  FRONTEND_URL=${config.frontendUrl}

⚠️  KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT!
⚠️  Add to .gitignore: DEPLOYMENT_CONFIG.txt
    `;
    
    fs.writeFileSync(configFile, content);
    console.log(`✅ Configuration saved to: ${configFile}\n`);
    console.log('⚠️  Remember to add this file to .gitignore!\n');
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Setup Complete!\n');
  console.log('Your Result Management System is ready for fail-proof deployment!\n');
  console.log('📖 For more info, see: FAILPROOF_DEPLOYMENT.md\n');

  rl.close();
}

// Run setup
setupDeployment().catch(error => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
