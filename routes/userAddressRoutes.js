const express = require("express");
const router = express.Router();

const {
  addAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../controllers/UserAddressController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Protected routes for addresses
router.post("/", verifyToken, addAddress); // Add a new address
router.get("/:userId", verifyToken, getUserAddresses); // Get all addresses for a user
router.get("/:addressId", verifyToken, getAddressById); // Get a specific address by ID
router.put("/:addressId", verifyToken, updateAddress); // Update an address
router.delete("/:addressId", verifyToken, deleteAddress); // Delete an address

module.exports = router;
