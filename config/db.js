const { Sequelize } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize("Reqfix", "root", "Rajat@123", {
  host: "localhost", // or your MySQL host
  dialect: "mysql",
  logging: (msg) => {
    if (msg.includes("Executing")) {
      return; // Suppress verbose execution logs
    }
    console.error(msg); // Log only errors
  },
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
