const express = require("express");
const {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getOrdersByServiceProvider,
  filterOrdersByStatus,
} = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Order Routes
router.post("/", verifyToken, createOrder); // Create a new order
router.get("/", verifyToken, getAllOrders); // Get all orders
router.get("/:id", verifyToken, getOrderById); // Get an order by ID
router.put("/:id", verifyToken, updateOrder); // Update an order by ID
// router.delete("/:id", verifyToken, deleteOrder); // Delete an order by ID
router.get("/customer/:customerId", verifyToken, getOrdersByCustomer); // Get orders by customer ID
router.get(
  "/service-provider/:serviceProviderId",
  verifyToken,
  getOrdersByServiceProvider
); // Get orders by service provider ID
router.get("/status/:status", verifyToken, filterOrdersByStatus); // Filter orders by status

module.exports = router;
