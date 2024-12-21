const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db"); // Sequelize instance
const cors = require("cors");
const app = express();
const PORT = 8080;

// Import routes
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const statusRoutes = require("./routes/statusRoutes");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to ReqFix" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/address", userAddressRoutes);
app.use("/api/status", statusRoutes);
// Sync Sequelize Models and Start Server
(async () => {
  try {
    // Ensure Sequelize is connected
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync models
    await sequelize.sync({ alter: true }); // Ensure database schema matches models
    console.log("Database synchronized with Sequelize models!");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    // Log detailed error if unable to connect or sync
    console.error(
      "Error initializing the server or connecting to the database:",
      error
    );
  }
})();
