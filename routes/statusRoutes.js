const express = require("express");
const {
  getStatusHistoryByOrder,
  addStatus,
  deleteStatusHistory,
} = require("../controllers/statusController");

const router = express.Router();

// Get status history for a specific order
router.get("/order/:orderId", getStatusHistoryByOrder);

// Add a new status to an order
router.post("/order/:orderId", addStatus);

// Delete a specific status history record
router.delete("/:statusId", deleteStatusHistory);

module.exports = router;
