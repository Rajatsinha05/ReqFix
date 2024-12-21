const { Feedback, Order, UserAccount } = require("../models");

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      include: [
        { model: Order, as: "Order" },
        { model: UserAccount, as: "Customer" },
        { model: UserAccount, as: "ServiceProvider" },
      ],
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create feedback for an order
exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback by order ID
exports.getFeedbackByOrder = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { order_id: req.params.orderId },
      include: [
        { model: UserAccount, as: "Customer" },
        { model: UserAccount, as: "ServiceProvider" },
      ],
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback by customer ID
exports.getFeedbackByCustomer = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { customer_id: req.params.customerId },
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback by service provider ID
exports.getFeedbackByServiceProvider = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { service_provider_id: req.params.serviceProviderId },
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
