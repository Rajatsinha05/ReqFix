const { Service, UserAccount } = require("../models");
const { ulid } = require("ulid");
// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: { model: UserAccount, as: "Provider" },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get services by user ID
exports.getServicesByUser = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { user_id: req.params.userId },
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    await service.update(req.body);
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    await service.destroy();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter services by criteria
exports.filterServices = async (req, res) => {
  const { average_rating, verified, category } = req.query;
  const filters = {};

  if (average_rating) filters.average_rating = { [Op.gte]: average_rating };
  if (verified) filters.verified = verified === "true";
  if (category) filters.category = { [Op.like]: `%${category}%` }; // Partial match for category

  try {
    const services = await Service.findAll({ where: filters });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching filtered services:", error);
    res.status(500).json({ message: error.message });
  }
};
// Function to create multiple services

exports.createMultipleServices = async (req, res) => {
  try {
    // Assuming `user.id` is available from authentication middleware
    const userId = req.user.id;

    // Get the array of services from the request body
    const services = req.body.services;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "No services provided." });
    }

    // Append `user_id` and generate `id` for each service
    const servicesWithIds = services.map((service) => ({
      ...service,
      id: ulid(), // Generate unique ID
      user_id: userId,
    }));

    // Create services in bulk
    const createdServices = await Service.bulkCreate(servicesWithIds, {
      validate: true, // Ensures each service passes the model validations
    });

    res.status(201).json({
      message: "Services created successfully.",
      data: createdServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating services.",
      error: error.message,
    });
  }
};

const { Op } = require("sequelize");

// Filter services by category
exports.getServicesByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    // Build filters dynamically
    const filters = {};
    if (category) {
      filters.category = {
        [Op.like]: `%${category}%`, // Use LIKE for partial matching
      };
    }

    const services = await Service.findAll({
      where: filters,
      include: { model: UserAccount, as: "Provider" }, // Include provider details if needed
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services by category:", error);
    res
      .status(500)
      .json({ message: "Error fetching services.", error: error.message });
  }
};
