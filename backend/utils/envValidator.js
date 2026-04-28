const logger = require('./logger');

/**
 * Validate required environment variables on startup
 */
const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const optional = ['EMAIL_USER', 'EMAIL_PASSWORD']; // Email notifications are optional
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  // Check optional email configuration
  const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
  if (!emailConfigured) {
    logger.warn('Email notifications are not configured. Set EMAIL_USER and EMAIL_PASSWORD to enable.');
  } else {
    logger.info('Email notifications are configured and enabled');
  }

  // Validate JWT_SECRET is strong enough
  if (process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET is less than 32 characters. Consider using a stronger secret.');
  }

  logger.info('Environment validation passed');
};

module.exports = { validateEnv };
