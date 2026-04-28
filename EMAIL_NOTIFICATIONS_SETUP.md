# Email Notifications Setup Guide

## Overview
Your Result Management System now supports automated email notifications for:
- ✉️ **Welcome emails** to new teachers and parents
- 📧 **Results posted notifications** to parents
- ⚠️ **Attendance alerts** to parents when attendance drops below threshold

## Prerequisites

### 1. Install Dependencies
Run this command in the `backend` folder:

```bash
npm install
```

This will install `nodemailer` (version 6.9.7) along with other dependencies.

## Configuration

### 1. Gmail Setup
The system is configured to use **Gmail's SMTP** service with your account:
- **Email**: `folushovictoryschool@gmail.com`
- **App Password**: `warh xoce oxsj ost`

### 2. Environment Variables
Add these to your `.env` file in the `backend` folder:

```bash
# Email Configuration (Gmail with App Password)
EMAIL_USER=folushovictoryschool@gmail.com
EMAIL_PASSWORD=warh xoce oxsj ost

# Optional: URLs for email links
FRONTEND_URL=http://localhost:3000
```

**Reference**: See `.env.example` for the complete template.

### 3. Important Security Notes
⚠️ **Never commit the App Password to Git**
- Add `.env` to `.gitignore` (should already be there)
- Keep the App Password secure
- Rotate it periodically for security

## Email Notification Features

### 1. Welcome Emails (On User Registration)

**Triggered when:**
- A new teacher is registered (if email provided)
- A new student/parent account is created (if parent email provided)

**Content:**
- Account credentials (username & temporary password)
- Instructions to change password
- Login information

**API Endpoints:**
```
POST /api/teachers/register
POST /api/students
```

**To enable**: Provide an `email` field when registering teachers, or `parentEmail` when creating students.

### 2. Results Posted Notifications

**Triggered when:**
- Results are released for a class

**Content:**
- Notification that results are posted
- Link to view results
- Student's class information

**API Endpoint:**
```
POST /api/results/release-results
```

**Request Body:**
```json
{
  "studentClass": "Form 3A",
  "term": "Term 1",
  "academicYear": "2024/2025"
}
```

**Response:**
```json
{
  "message": "Results released successfully",
  "studentsCount": 45,
  "emailsSent": 42,
  "emailsFailed": 3,
  "class": "Form 3A",
  "term": "Term 1",
  "academicYear": "2024/2025"
}
```

### 3. Attendance Alerts

**Triggered when:**
- Attendance check is run and students fall below threshold

**Content:**
- Student's current attendance percentage
- Alert level (WARNING/CRITICAL)
- Class information

**API Endpoint:**
```
POST /api/attendance/check-alerts
```

**Request Body:**
```json
{
  "studentClass": "Form 3A",
  "attendanceThreshold": 75
}
```

**Response:**
```json
{
  "message": "Attendance check completed",
  "class": "Form 3A",
  "attendanceThreshold": 75,
  "lowAttendanceCount": 5,
  "alertsSent": 4,
  "alertsFailed": 1,
  "lowAttendanceStudents": [
    {
      "student": "John Doe",
      "percentage": 65.5,
      "presentDays": 13,
      "totalDays": 20
    }
  ]
}
```

### 4. Attendance Percentage Endpoint

**Get a student's attendance percentage:**
```
GET /api/attendance/student/:studentId/percentage
```

**Response:**
```json
{
  "percentage": 87.5,
  "totalDays": 40,
  "presentDays": 35
}
```

## Testing Email Configuration

### Method 1: Via API (Recommended)

Create a new endpoint file `backend/routes/test.js`:

```javascript
const express = require('express');
const router = express.Router();
const { sendTestEmail } = require('../utils/emailService');

router.post('/test-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const result = await sendTestEmail(email);
  res.json(result);
});

module.exports = router;
```

Then add to `backend/server.js`:
```javascript
const testRoutes = require('./routes/test');
app.use('/api/test', testRoutes);
```

Test with:
```bash
curl -X POST http://localhost:5000/api/test/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"folushovictoryschool@gmail.com"}'
```

### Method 2: Manual Test

Add this to the top of any route file and call it:

```javascript
const { sendTestEmail } = require("../utils/emailService");

// Somewhere in the route
await sendTestEmail("folushovictoryschool@gmail.com");
```

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**
   - Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
   - Ensure they're not quoted unless the value contains spaces

2. **Gmail App Password Issues**
   - Confirm 2-Step Verification is enabled on your Google Account
   - The App Password should be 16 characters (spaces don't count)
   - Try generating a new App Password

3. **Check Logs**
   - Look at the backend console for email send logs
   - Search for: "Email sent to" or "Failed to send email"

4. **Common Errors**
   - `Invalid login`: Check email/password in .env
   - `Service unavailable`: Gmail SMTP server temporarily down
   - `Connection timeout`: Check network/firewall settings

### Recipient Not Receiving Emails

1. **Check spam folder** - First check recipient's spam/junk folder
2. **Whitelist sender** - Add `folushovictoryschool@gmail.com` to contacts
3. **Invalid email address** - Verify email format in database
4. **Email not provided** - Ensure email field is populated when creating users

## Database Considerations

### Email Field Requirements

The following models need email fields:
- ✅ `User` model - Already has `email` field
- ✅ `Student` model - Parent's email stored via `parent` relationship

### Optional: Email Verification

For production, consider adding email verification:
1. Send verification link on registration
2. Only enable notifications after verification
3. Store `emailVerified` boolean flag

## Performance Notes

- Email sending is **non-blocking** - doesn't slow down API responses
- Failed emails don't prevent successful operations
- Attendance check alerts processes all students efficiently

## Future Enhancements

Consider implementing:
1. Email templates customization
2. Scheduled email reports
3. Email delivery tracking/logging
4. User email subscription preferences
5. Multi-language email templates
6. SMS notifications (using Twilio)

## Support

For issues:
1. Check the logs in `backend/utils/logger.js` output
2. Verify Gmail account security settings
3. Test with a simple curl request to the endpoint
4. Check network connectivity to Gmail SMTP server

---

**Email Configuration:**
- Email: `folushovictoryschool@gmail.com`
- Status: ✅ Configured and Ready
- Provider: Gmail SMTP
