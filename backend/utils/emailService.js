const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email with template
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text content (optional)
 */
async function sendEmail(to, subject, html, text = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(to, userName, tempPassword) {
  const subject = 'Welcome to Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Result Management System</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Your account has been created successfully. You can now log in using your credentials:</p>
      
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      
      <p style="color: #d32f2f;"><strong>Important:</strong> Please change your password immediately after logging in.</p>
      
      <p>If you have any questions, please contact the school administration.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send results posted notification to student/parent
 */
async function sendResultsNotification(to, userName, className, resultsLink) {
  const subject = 'New Results Posted - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">Results Posted</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>New results have been posted for <strong>${className}</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resultsLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Results
        </a>
      </div>
      
      <p>Log in to the Result Management System to view detailed results and performance analysis.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send attendance alert to parent
 */
async function sendAttendanceAlert(to, studentName, attendancePercentage, className) {
  const subject = 'Attendance Alert - Result Management System';
  const alertLevel = attendancePercentage < 75 ? 'critical' : 'warning';
  const color = attendancePercentage < 75 ? '#d32f2f' : '#f57c00';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">Attendance Alert</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is to inform you that <strong>${studentName}</strong>'s attendance in <strong>${className}</strong> requires attention.</p>
      
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid ${color};">
        <p><strong>Current Attendance:</strong> ${attendancePercentage.toFixed(2)}%</p>
        <p style="color: ${color}; font-weight: bold;">Status: ${alertLevel === 'critical' ? 'CRITICAL' : 'WARNING'}</p>
      </div>
      
      <p>Please ensure regular attendance to avoid any academic impact. For more details, log in to the Result Management System.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send password reset link
 */
async function sendPasswordResetEmail(to, userName, resetLink) {
  const subject = 'Password Reset - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

/**
 * Send test email to verify configuration
 */
async function sendTestEmail(to) {
  const subject = 'Test Email - Result Management System';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Test Email Successful ✓</h2>
      <p>This is a test email to verify that email notifications are configured correctly.</p>
      <p style="color: #666;">You can now receive email notifications from the Result Management System.</p>
    </div>
  `;

  return sendEmail(to, subject, html);
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendResultsNotification,
  sendAttendanceAlert,
  sendPasswordResetEmail,
  sendTestEmail,
};
