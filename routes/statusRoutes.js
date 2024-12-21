const express = require("express");
const {
  getStatusHistoryByOrder,
  addStatus,
  deleteStatusHistory,
} = require("../controllers/statusController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get status history for a specific order
router.get("/order/:orderId", verifyToken, getStatusHistoryByOrder);

// Add a new status to an order
router.post("/order/:orderId", verifyToken, addStatus);

// Delete a specific status history record
router.delete("/:statusId", verifyToken, deleteStatusHistory);

module.exports = router;
