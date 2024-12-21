const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { ulid } = require("ulid");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    services_offered: { type: DataTypes.TEXT , allowNull: false },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    image: { type: DataTypes.STRING },
    average_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    feedback_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    availability: { type: DataTypes.BOOLEAN, defaultValue: true },
    location: { type: DataTypes.STRING, allowNull: true },
    discount: { type: DataTypes.FLOAT, defaultValue: 0 },
    duration: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "services",
    timestamps: true,
    paranoid: true, // Enables soft deletes
  }
);

Service.beforeCreate((service) => {
  service.id = ulid();
});

module.exports = Service;
