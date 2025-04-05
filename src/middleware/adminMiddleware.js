const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = adminMiddleware;

