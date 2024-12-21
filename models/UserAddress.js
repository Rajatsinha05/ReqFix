const { DataTypes } = require("sequelize");
const { ulid } = require("ulid");
const sequelize = require("../config/db");

const UserAddress = sequelize.define(
  "user_addresses",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE", // Deletes addresses if the user is deleted
    },
    address_line1: { type: DataTypes.STRING, allowNull: false },
    address_line2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    postal_code: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "user_addresses",
    timestamps: false,
  }
);

// Generate ULID before creating a record
UserAddress.beforeCreate((address) => {
  address.id = ulid();
});

module.exports = UserAddress;
