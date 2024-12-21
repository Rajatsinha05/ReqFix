const { Service, UserAccount } = require("../models");

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
  const { average_rating, verified } = req.query;
  const filters = {};

  if (average_rating) filters.average_rating = { [Op.gte]: average_rating };
  if (verified) filters.verified = verified === "true";

  try {
    const services = await Service.findAll({ where: filters });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
