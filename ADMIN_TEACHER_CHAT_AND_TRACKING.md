# Admin-Teacher Chat & Activity Tracking System

## Overview
This document describes the new admin-to-teacher chat system and comprehensive activity tracking features added to monitor teacher activities and credibility.

## Features

### 1. Admin-to-Teacher Chat System
Direct messaging between admin and teachers with support for:
- Text messages with subject lines
- Message priorities (GENERAL, ALERT, URGENT)
- Read/unread status tracking
- Message history and search

#### Chat Endpoints:
- **POST /api/messages/send** - Admin sends message to teacher
- **GET /api/messages/teacher/:teacherId** - Get conversation history with a teacher
- **GET /api/messages** - Get all messages (admin only)
- **PUT /api/messages/:messageId/read** - Mark message as read
- **GET /api/messages/unread/count** - Get unread message count

### 2. Comprehensive Activity Tracking
Automatic logging of all significant teacher activities:

#### Tracked Activities:
- LOGIN - Teacher login
- LOGOUT - Teacher logout
- CREATE_RESULT - New result entry
- UPDATE_RESULT - Result modification
- DELETE_RESULT - Result deletion
- CREATE_ATTENDANCE - Attendance entry
- UPDATE_ATTENDANCE - Attendance modification
- DELETE_ATTENDANCE - Attendance deletion
- ACCESS_STUDENT_DATA - Accessing student information
- EXPORT_DATA - Data export
- CHANGE_PASSWORD - Password changes
- PROFILE_UPDATE - Profile modifications
- OTHER - Other activities

#### Activity Log Fields:
- **teacherId** - Teacher performing the action
- **activityType** - Type of activity
- **description** - Detailed description
- **severity** - Activity severity (LOW, MEDIUM, HIGH, CRITICAL)
- **ipAddress** - IP address of the user
- **userAgent** - Browser/device information
- **affectedResource** - What was affected by the action
- **emailSent** - Whether admin was notified
- **timestamp** - When the activity occurred

### 3. Email Notifications
High and critical severity activities automatically send email alerts to admin:
- Email: folushovictoryschool@gmail.com
- Includes: Teacher name, activity type, timestamp, IP address, details
- Formatted with color-coded severity levels

#### Activity Tracking Endpoints:
- **GET /api/activities/teacher/:teacherId** - Get activities for a teacher (admin only)
- **GET /api/activities/my-activities** - Teachers can view their own activities
- **GET /api/activities/summary/dashboard** - Activity summary (admin only)
- **GET /api/activities/alerts/high-severity** - High/critical alerts (admin only)
- **GET /api/activities/stats/:teacherId** - Activity statistics for a teacher (admin only)

## Configuration

### Environment Variables Required
```bash
# Email notifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Admin Dashboard Integration
The admin can:
1. Send messages to teachers
2. View all teacher activities
3. Set message priorities (GENERAL, ALERT, URGENT)
4. View activity summaries and statistics
5. Track teacher credibility through activity logs
6. Receive automated alerts for critical activities

## Usage Examples

### Sending a Message to Teacher
```bash
POST /api/messages/send
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "recipientId": 2,
  "subject": "Results Review Required",
  "content": "Please review the results for Class 3B before end of day",
  "messageType": "ALERT"
}
```

### Retrieving Teacher Activities
```bash
GET /api/activities/teacher/:teacherId?limit=50&offset=0
Authorization: Bearer <admin-token>
```

### Getting High-Severity Alerts
```bash
GET /api/activities/alerts/high-severity?limit=100
Authorization: Bearer <admin-token>
```

## Activity Severity Levels

- **LOW** - Routine activities (login, logout, profile updates)
- **MEDIUM** - Data modifications (create/update results, attendance)
- **HIGH** - Deletions (delete results, delete attendance records)
- **CRITICAL** - Suspicious or concerning activities

## Email Alert Example
When a high or critical activity occurs, the admin receives an email with:
- Teacher name
- Activity type and description
- Severity level (color-coded)
- Timestamp
- IP address
- Affected resource
- Link to review in admin dashboard

## Security Notes
1. Only admins can view all teacher activities
2. Teachers can only view their own activities
3. All activities are timestamped and logged
4. IP addresses are recorded for security auditing
5. Email alerts ensure immediate notification of important activities
6. Activity logs are immutable (cannot be deleted)

## Benefits
- **Credibility Tracking** - Monitor teacher faithfulness and dedication
- **Audit Trail** - Complete history of all actions for compliance
- **Real-time Alerts** - Immediate notification of critical activities
- **Communication** - Direct admin-teacher messaging
- **Data Protection** - Track who accessed what and when
- **Performance Metrics** - Analyze teacher activity patterns

## Database Tables
- `Messages` - Stores all chat messages
- `ActivityLogs` - Stores all teacher activities

Both tables include proper indexing for fast queries and support filtering, searching, and reporting.
