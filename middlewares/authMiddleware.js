const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = "Req-fix"; // Replace with the same secure key used in your controller

// Middleware to verify the token
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    // Verify the token

    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded; // Attach user info to request object
    

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
