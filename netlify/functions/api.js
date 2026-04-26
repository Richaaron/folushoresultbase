// Netlify serverless function
process.env.NODE_ENV = 'production';

// Set NODE_PATH to include root node_modules so backend can find dependencies
const path = require('path');
process.env.NODE_PATH = path.join(__dirname, '../../node_modules') + path.delimiter + (process.env.NODE_PATH || '');
require('module').Module._initPaths();

// Load environment variables from .env file in development
// In Netlify, use dashboard to set environment variables
if (process.env.NETLIFY === 'true' || !process.env.DATABASE_URL) {
  require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });
}

const serverless = require('serverless-http');
const app = require('../../backend/server');

exports.handler = serverless(app);



