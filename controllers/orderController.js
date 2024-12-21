const { Order, UserAccount, StatusHistory, Service } = require("../models");
const { Op } = require("sequelize");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: UserAccount,
          as: "Customer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: UserAccount,
          as: "ServiceProvider",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: StatusHistory,
          as: "StatusHistories",
          include: [
            {
              model: UserAccount,
              as: "ChangedBy",
              attributes: ["id", "full_name", "email"],
            },
          ],
          attributes: ["id", "status", "changed_at", "comment"],
        },
        {
          model: Service,
          as: "Service",
          
        },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
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
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get an order by ID with status history
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: UserAccount,
          as: "Customer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: UserAccount,
          as: "ServiceProvider",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: StatusHistory,
          as: "StatusHistories",
          include: [
            {
              model: UserAccount,
              as: "ChangedBy",
              attributes: ["id", "full_name", "email"],
            },
          ],
          attributes: ["id", "status", "changed_at", "comment"],
        },
        {
          model: Service,
          as: "Service",
       
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
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
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders by customer ID
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.params.customerId },
      include: [
        {
          model: UserAccount,
          as: "Customer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: UserAccount,
          as: "ServiceProvider",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: StatusHistory,
          as: "StatusHistories",
          include: [
            {
              model: UserAccount,
              as: "ChangedBy",
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders by service provider ID
exports.getOrdersByServiceProvider = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { service_provider_id: req.params.serviceProviderId },
      include: [
        {
          model: UserAccount,
          as: "Customer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: StatusHistory,
          as: "StatusHistories",
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by service provider:", error);
    res.status(500).json({ message: error.message });
  }
};

// Filter orders by status
exports.filterOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  const validStatuses = [
    "PENDING",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELED",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const orders = await Order.findAll({
      where: { status },
      include: [
        {
          model: UserAccount,
          as: "Customer",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: UserAccount,
          as: "ServiceProvider",
          attributes: ["id", "full_name", "email"],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error filtering orders by status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new status to an order
exports.addStatusToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, comment } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newStatus = await StatusHistory.create({
      order_id: orderId,
      status,
      changed_by: req.user.id,
      comment,
    });

    res.status(201).json(newStatus);
  } catch (error) {
    console.error("Error adding status to order:", error);
    res.status(500).json({ message: error.message });
  }
};
