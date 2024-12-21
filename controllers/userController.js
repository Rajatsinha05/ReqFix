const { UserAccount, UserAddress, Service } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = "Req-fix"; // Replace with a secure key

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserAccount.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: _, ...userWithoutPassword } = user.toJSON();

    res
      .status(200)
      .json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      contact_number,
      address,
      preferred_payment_method,
    } = req.body;

    const existingUser = await UserAccount.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserAccount.create({
      ...req.body,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res
      .status(201)
      .json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserAccount.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await UserAccount.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details (check if password needs hashing)
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await user.update(updates);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await UserAccount.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserWithServices = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserAccount.findByPk(userId, {
      include: [
        {
          model: UserAddress,
          as: "addresses",
          required: false, // Do not enforce the presence of addresses
        },
        {
          model: Service,
          as: "Services",
          required: false, // Do not enforce the presence of services
        },
      ],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users with services and addresses
exports.getAllUsersWithServices = async (req, res) => {
  try {
    const users = await UserAccount.findAll({
      include: [
        {
          model: UserAddress,
          as: "addresses",
          required: false, // Do not enforce the presence of addresses
        },
        {
          model: Service,
          as: "Services",
          required: false, // Do not enforce the presence of services
        },
      ],
    });

    // Respond with users even if they have no addresses or services
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
