const { Order, UserAccount, StatusHistory } = require("../models");
const { Op } = require("sequelize");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: UserAccount, as: "Customer" },
        { model: UserAccount, as: "ServiceProvider" },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order with initial status
exports.createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  try {
    // Create the order
    req.body.customer_id = req.user.id;
    const order = await Order.create(req.body, { transaction });

    // Add the initial status
    await StatusHistory.create(
      {
        order_id: order.id,
        status: "PENDING",
        changed_by: req.user.id,
        comment: "Order placed by customer.",
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(order);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

// Get an order by ID with status history
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: UserAccount, as: "Customer" },
        { model: UserAccount, as: "ServiceProvider" },
        {
          model: StatusHistory,
          include: [
            {
              model: UserAccount,
              attributes: ["id", "name", "email"],
            },
          ],
          attributes: ["id", "status", "changed_at", "comment"],
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.update(req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Delete an order by ID
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     await order.destroy();
//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get orders by customer ID
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.params.customerId },
      include: { model: UserAccount, as: "ServiceProvider" },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by service provider ID
exports.getOrdersByServiceProvider = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { service_provider_id: req.params.serviceProviderId },
      include: { model: UserAccount, as: "Customer" },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter orders by status
exports.filterOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  if (
    !["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELED"].includes(
      status
    )
  ) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const orders = await Order.findAll({
      include: [
        { model: UserAccount, as: "Customer" },
        { model: UserAccount, as: "ServiceProvider" },
      ],
      where: { status },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new status to an order
exports.addStatusToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, changed_by, comment } = req.body;

    // Check if the order exists
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Add a new status entry
    const newStatus = await StatusHistory.create({
      order_id: orderId,
      status,
      changed_by,
      comment,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
