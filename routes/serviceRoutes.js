const express = require("express");
const {
  getAllServices,
  createService,
  getServicesByUser,
  updateService,
  deleteService,
  filterServices,
  createMultipleServices,
} = require("../controllers/serviceController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Service routes
router.get("/", getAllServices); // Get all services
router.post("/", verifyToken, createService); // Create a new service
router.get("/user/:userId", verifyToken, getServicesByUser); // Get services by user ID
router.put("/:id", verifyToken, updateService); // Update a service by ID
router.delete("/:id", verifyToken, deleteService); // Delete a service by ID
router.get("/filter", filterServices); // Filter services by criteria
router.post("/bulk", verifyToken, createMultipleServices);
module.exports = router;
