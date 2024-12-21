const { DataTypes } = require("sequelize");
const { ulid } = require("ulid");
const sequelize = require("../config/db");

const Feedback = sequelize.define(
  "Feedback",
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
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    service_provider_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comments: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "feedback",
    timestamps: false,
  }
);

Feedback.beforeCreate((feedback) => {
  feedback.id = ulid();
});

module.exports = Feedback;
