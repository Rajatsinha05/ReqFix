const { UserAddress, UserAccount, sequelize } = require("../models");

// Add a new address for a user
exports.addAddress = async (req, res) => {
  try {
    const {
      user_id,
      address_line1,
      city,
      state,
      postal_code,
      country,
      is_primary,
    } = req.body;

    // Validate required fields
    if (
      !user_id ||
      !address_line1 ||
      !city ||
      !state ||
      !postal_code ||
      !country
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Ensure the user exists
    const user = await UserAccount.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Start a transaction for atomic operations
    const transaction = await sequelize.transaction();

    try {
      // Update other addresses to not be primary if is_primary is true
      if (is_primary) {
        await UserAddress.update(
          { is_primary: false },
          { where: { user_id }, transaction }
        );
      }

      const newAddress = await UserAddress.create(
        { ...req.body },
        { transaction }
      );
      await transaction.commit();

      res.status(201).json({ success: true, data: newAddress });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user existence
    const user = await UserAccount.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const addresses = await UserAddress.findAll({ where: { user_id: userId } });

    if (!addresses.length) {
      return res
        .status(404)
        .json({ success: false, message: "No addresses found" });
    }

    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single address by ID
exports.getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await UserAddress.findByPk(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { is_primary, ...updateData } = req.body;

    const address = await UserAddress.findByPk(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    const transaction = await sequelize.transaction();
    try {
      // Update primary status
      if (is_primary) {
        await UserAddress.update(
          { is_primary: false },
          { where: { user_id: address.user_id }, transaction }
        );
      }

      const updatedAddress = await address.update(
        { is_primary, ...updateData },
        { transaction }
      );
      await transaction.commit();

      res.status(200).json({ success: true, data: updatedAddress });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await UserAddress.findByPk(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    await address.destroy();
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
