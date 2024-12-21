const { DataTypes } = require("sequelize");
const { ulid } = require("ulid");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    service_provider_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "SET NULL", // Set to NULL when the referenced user is deleted
    },
    service_id: {
      type: DataTypes.STRING,
      allowNull: false, // Service must always be associated with an order
      references: { model: "services", key: "id" },
      onDelete: "CASCADE", // Delete the order if the associated service is deleted
    },
    total_cost: { type: DataTypes.FLOAT },
    prefer_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estimated_delivery_time: { type: DataTypes.DATE },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

Order.beforeCreate((order) => {
  order.id = ulid();
});

module.exports = Order;
