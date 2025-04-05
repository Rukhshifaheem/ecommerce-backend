const Cart = require("../models/cart");

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email") // 👈 gets user name + email
      .populate("items.productId", "name new_price old_price"); // 👈 optional: show product title/price

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getAllCarts };
