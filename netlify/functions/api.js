// Netlify serverless function - wraps Express app
require('dotenv').config();

const serverless = require('serverless-http');

// Initialize database on cold start
let app;

const initializeApp = async () => {
  if (app) return app;

  // Dynamically require to ensure fresh imports
  const sequelize = require('../../backend/utils/db');
  
  // Initialize all models
  require('../../backend/models/User');
  require('../../backend/models/Subject');
  require('../../backend/models/Student');
  require('../../backend/models/Result');
  require('../../backend/models/Attendance');
  require('../../backend/models/Setting');
  require('../../backend/models/StudentSubject');

  // Get the app
  app = require('../../backend/server');
  
  return app;
};

exports.handler = async (event, context) => {
  const application = await initializeApp();
  const handler = serverless(application);
  return handler(event, context);
};


