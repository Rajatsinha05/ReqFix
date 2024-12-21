const { StatusHistory, Order, User } = require("../models");

// Get status history for a specific order
const getStatusHistoryByOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const statusHistory = await StatusHistory.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Include details of the user who changed the status
        },
      ],
      order: [["changed_at", "ASC"]], // Order by time of change
    });

    if (!statusHistory || statusHistory.length === 0) {
      return res
        .status(404)
        .json({ error: "No status history found for this order" });
    }

    return res.status(200).json(statusHistory);
  } catch (error) {
    console.error("Error fetching status history:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new status to an order
const addStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, comment } = req.body;
  console.log('comment: ', comment,req.user.id);

  try {
    // Check if the order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Add new status history entry
    const newStatus = await StatusHistory.create({
      order_id: orderId,
      status,
      changed_by:req.user?.id,
      comment,
    });

    return res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error adding status:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a specific status history record
const deleteStatusHistory = async (req, res) => {
  const { statusId } = req.params;

  try {
    const statusHistory = await StatusHistory.findByPk(statusId);

    if (!statusHistory) {
      return res.status(404).json({ error: "Status history not found" });
    }

    // Update the status to "CANCELED"
    await statusHistory.update({ status: "CANCELED" });

    return res
      .status(200)
      .json({ message: "canceled successfully", statusHistory });
  } catch (error) {
    console.error("Error :", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export controller methods
module.exports = {
  getStatusHistoryByOrder,
  addStatus,
  deleteStatusHistory,
};
