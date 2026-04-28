const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { getTeacherActivityLogs, getActivitySummary } = require("../utils/activityTracker");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");
const logger = require("../utils/logger");

// Get activity logs for a specific teacher (admin only)
router.get(
  "/teacher/:teacherId",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const { limit = 100, offset = 0, startDate, endDate, activityType } = req.query;

    // Verify teacher exists
    const teacher = await User.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const activities = await getTeacherActivityLogs(parseInt(teacherId), {
      limit: parseInt(limit),
      offset: parseInt(offset),
      startDate,
      endDate,
      activityType,
    });

    res.json({
      activities: activities.rows,
      total: activities.count,
      teacher: { id: teacher.id, fullName: teacher.fullName },
    });
  })
);

// Get activity logs for current user (teachers can see their own)
router.get(
  "/my-activities",
  auth,
  asyncHandler(async (req, res) => {
    if (req.user.role !== "TEACHER") {
      return res.status(403).json({ error: "Only teachers can access their own activities" });
    }

    const { limit = 50, offset = 0 } = req.query;

    const activities = await ActivityLog.findAndCountAll({
      where: { teacherId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      activities: activities.rows,
      total: activities.count,
    });
  })
);

// Get activity summary for admin dashboard
router.get(
  "/summary/dashboard",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { days = 7 } = req.query;
    const summary = await getActivitySummary(parseInt(days));

    res.json(summary);
  })
);

// Get all high-severity activities (admin only)
router.get(
  "/alerts/high-severity",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { limit = 100, offset = 0 } = req.query;

    const alerts = await ActivityLog.findAndCountAll({
      where: {
        severity: {
          [require("sequelize").Op.in]: ["HIGH", "CRITICAL"],
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email"],
          foreignKey: "teacherId",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      alerts: alerts.rows,
      total: alerts.count,
    });
  })
);

// Get activity statistics for a teacher
router.get(
  "/stats/:teacherId",
  auth,
  authorize(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total activities
    const totalActivities = await ActivityLog.count({
      where: {
        teacherId: parseInt(teacherId),
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
    });

    // Activities by type
    const activitiesByType = await ActivityLog.findAll({
      where: {
        teacherId: parseInt(teacherId),
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
      attributes: [
        "activityType",
        [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
      ],
      group: ["activityType"],
      raw: true,
    });

    // High-severity activities
    const highSeverityCount = await ActivityLog.count({
      where: {
        teacherId: parseInt(teacherId),
        severity: { [require("sequelize").Op.in]: ["HIGH", "CRITICAL"] },
        createdAt: {
          [require("sequelize").Op.gte]: startDate,
        },
      },
    });

    // Last login
    const lastLogin = await ActivityLog.findOne({
      where: {
        teacherId: parseInt(teacherId),
        activityType: "LOGIN",
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalActivities,
      activitiesByType,
      highSeverityCount,
      lastLogin: lastLogin?.createdAt || null,
      period: `Last ${days} days`,
    });
  })
);

module.exports = router;
