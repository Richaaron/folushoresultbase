const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./User");

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  activityType: {
    type: DataTypes.ENUM(
      "LOGIN",
      "LOGOUT",
      "CREATE_RESULT",
      "UPDATE_RESULT",
      "DELETE_RESULT",
      "CREATE_ATTENDANCE",
      "UPDATE_ATTENDANCE",
      "DELETE_ATTENDANCE",
      "ACCESS_STUDENT_DATA",
      "EXPORT_DATA",
      "CHANGE_PASSWORD",
      "PROFILE_UPDATE",
      "OTHER"
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  affectedResource: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  severity: {
    type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL"),
    defaultValue: "LOW",
  },
  emailSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations
ActivityLog.belongsTo(User, { foreignKey: "teacherId" });

module.exports = ActivityLog;
