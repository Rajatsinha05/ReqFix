const { DataTypes } = require("sequelize");
const { ulid } = require("ulid");
const sequelize = require("../config/db");

const StatusHistory = sequelize.define(
  "status_history",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "orders", key: "id" },
    },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACCEPTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELED"
      ),
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "status_history",
    timestamps: false,
  }
);

StatusHistory.beforeCreate((statusHistory) => {
  statusHistory.id = ulid();
});

module.exports = StatusHistory;
