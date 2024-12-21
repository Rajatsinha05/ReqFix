const { DataTypes } = require("sequelize");
const { ulid } = require("ulid");
const sequelize = require("../config/db");

const UserAccount = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("CUSTOMER", "SERVICE_PROVIDER", "ADMIN"),
      allowNull: false,
    },
    contact_number: { type: DataTypes.STRING, allowNull: true },
    preferred_payment_method: { type: DataTypes.STRING, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Generate ULID before creating a record
UserAccount.beforeCreate((user) => {
  user.id = ulid();
});

module.exports = UserAccount;
