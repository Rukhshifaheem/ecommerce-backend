// const mongoose = require('mongoose');

// const Cart = require('../models/cart.js');
// const Product = require('../models/product.js');

// const addToCart = async (req, res) => {
//     try {
//         const userId = req.user.id;  // Get user ID from token
//         const { itemId, quantity } = req.body;

//         if (!itemId || quantity <= 0) {
//             return res.status(400).json({ message: "Invalid item or quantity" });
//         }

//         // Find product using `itemId` field (since it's a UUID, not an ObjectId)
//         // const product = await Product.findById(new mongoose.Types.ObjectId(itemId));
//         const product = await Product.findOne({ id: itemId });


//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             cart = new Cart({
//                 userId,
//                 items: [{ productId: itemId, quantity }]
//             });
//         } else {
//             const itemIndex = cart.items.findIndex(item => item.productId.toString() === itemId);

//             if (itemIndex > -1) {
//                 cart.items[itemIndex].quantity += quantity;
//             } else {
//                 cart.items.push({ productId: itemId, quantity });
//             }
//         }

//         await cart.save();
//         res.status(200).json({ message: "Item added to cart successfully", cart });

//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// module.exports = { addToCart };





const mongoose = require("mongoose");
const Cart = require("../models/cart.js");
const Product = require("../models/product.js");

// Add item to cart
const addToCart = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {  // Change from .id to ._id
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
      }
  
      const userId = req.user.id;  // Change from .id to ._id
      const { itemId, quantity } = req.body;
  
      if (!itemId || quantity <= 0 || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }
  
      const product = await Product.findById(itemId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        // If cart doesn't exist, create one
        cart = new Cart({
          userId,
          items: [{ productId: itemId, quantity }],
        });
      } else {
        // If cart exists, check if product is already in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === itemId);
  
        if (itemIndex > -1) {
          // If product exists, update the quantity
          cart.items[itemIndex].quantity += quantity;
        } else {
          // If product doesn't exist, add it to the cart
          cart.items.push({ productId: itemId, quantity });
        }
      }
  
      // Log the cart to check if updates are being applied
      console.log("Updated cart:", cart);
  
      await cart.save();
      res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {  
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const userId = req.user.id;  
        const { itemId } = req.body;

        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === itemId);
        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                // Decrease quantity if more than 1
                cart.items[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity is 1
                cart.items.splice(itemIndex, 1);
            }
            
            await cart.save();
            return res.status(200).json({ message: "Item updated in cart", cart });
        }

        res.status(404).json({ message: "Item not found in cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = { addToCart, removeFromCart };
