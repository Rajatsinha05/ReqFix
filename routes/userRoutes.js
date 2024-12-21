const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserWithServices,
  getAllUsersWithServices,
} = require("../controllers/userController");

// Public routes
router.post("/signup", createUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", verifyToken, getAllUsers);
router.get("/with-services", verifyToken, getAllUsersWithServices); // Get all users with their associated services
router.get("/:userId", verifyToken, getUserById);
router.get("/:userId/with-services", verifyToken, getUserWithServices); // Get a user by ID with their associated services
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
