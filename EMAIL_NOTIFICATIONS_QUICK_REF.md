# Email Notifications - Quick Reference

## Quick Setup (60 seconds)

1. **Install dependencies:**
   ```bash
   cd backend && npm install
   ```

2. **Add to `.env`:**
   ```bash
   EMAIL_USER=folushovictoryschool@gmail.com
   EMAIL_PASSWORD=warh xoce oxsj ost
   FRONTEND_URL=http://localhost:3000
   ```

3. **Done!** 🎉 Email notifications are now active.

## Email Triggers

| Event | API Endpoint | When Triggered |
|-------|-------------|-----------------|
| Welcome Email | `POST /api/teachers/register` | Teacher registered with email |
| Welcome Email | `POST /api/students` | Student created with parentEmail |
| Results Posted | `POST /api/results/release-results` | When results are released to class |
| Attendance Alert | `POST /api/attendance/check-alerts` | When checking student attendance |

## API Examples

### Register Teacher (with email)
```bash
curl -X POST http://localhost:5000/api/teachers/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "email": "john.smith@school.com",
    "isFormTeacher": true
  }'
```

### Create Student (with parent email)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "registrationNumber": "STU001",
    "studentClass": "Form 3A",
    "parentEmail": "parent@email.com"
  }'
```

### Release Results (sends notifications)
```bash
curl -X POST http://localhost:5000/api/results/release-results \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentClass": "Form 3A",
    "term": "Term 1",
    "academicYear": "2024/2025"
  }'
```

### Check Attendance Alerts
```bash
curl -X POST http://localhost:5000/api/attendance/check-alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentClass": "Form 3A",
    "attendanceThreshold": 75
  }'
```

## Email Service Functions

Located in `backend/utils/emailService.js`:

```javascript
sendEmail(to, subject, html, text)              // Generic email
sendWelcomeEmail(to, userName, password)        // Welcome email
sendResultsNotification(to, userName, class, link)  // Results posted
sendAttendanceAlert(to, studentName, percent, class) // Attendance alert
sendPasswordResetEmail(to, userName, link)      // Password reset
sendTestEmail(to)                               // Test email
```

## Customizing Email Templates

Edit `backend/utils/emailService.js`:

1. **Welcome Email**: Lines 47-71
2. **Results Email**: Lines 76-104
3. **Attendance Alert**: Lines 109-150
4. **Password Reset**: Lines 155-186

## Status Check

Check if email is configured:
```javascript
// In any route file
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  console.log('Email notifications: ENABLED');
} else {
  console.log('Email notifications: DISABLED');
}
```

## Logging

Email events are logged to console and logger:

```
[INFO] Email sent to parent@email.com: 123456789@gmail.com
[WARN] Failed to send email to invalid@: ENOTFOUND
```

Check `backend/utils/logger.js` for log configuration.

## Important Notes

- ⚠️ **Never commit `.env` to Git**
- ✅ Email failures don't break API operations
- 📧 Email sending is async (non-blocking)
- 🔒 App Password is more secure than account password
- 📱 Parent emails must be valid for notifications to work

## Need to Modify Something?

### Change Email Provider
Update `backend/utils/emailService.js`:
- Service: `service: 'gmail'` → another provider
- Auth: Update `auth` config

### Add New Notification Type
1. Create new function in `emailService.js`
2. Import in route file
3. Call where needed

### Change Email Template Design
Edit HTML in email functions in `emailService.js` - supports full HTML with CSS

### Disable Specific Notifications
Add environment flags:
```bash
SEND_WELCOME_EMAILS=true
SEND_RESULTS_NOTIFICATIONS=true
SEND_ATTENDANCE_ALERTS=true
```

Then check before sending:
```javascript
if (process.env.SEND_WELCOME_EMAILS === 'true') {
  await sendWelcomeEmail(...);
}
```

---

**Email Configured**: `folushovictoryschool@gmail.com` ✅
