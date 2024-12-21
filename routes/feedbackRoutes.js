const express = require("express");
const {  getAllFeedback,
    createFeedback,
    getFeedbackByOrder,
    getFeedbackByCustomer,
    getFeedbackByServiceProvider, } = require("../controllers/feedbackController");


const router = express.Router();

// Feedback routes
router.get("/", getAllFeedback); // Get all feedback
router.post("/", createFeedback); // Create feedback for an order
router.get("/order/:orderId", getFeedbackByOrder); // Get feedback by order ID
router.get("/customer/:customerId", getFeedbackByCustomer); // Get feedback by customer
router.get(
  "/service-provider/:serviceProviderId",
  getFeedbackByServiceProvider
); // Get feedback by service provider

module.exports = router;
