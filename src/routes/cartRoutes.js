const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart } = require("../controllers/cartController.js"); // Import both functions
const authMiddleware = require("../middleware/authMiddleware.js");

// Route to add item to cart
router.post("/addToCart", authMiddleware, addToCart);

// Route to remove item from cart
router.post("/removeFromCart", authMiddleware, removeFromCart);

module.exports = router;
