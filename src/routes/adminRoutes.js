const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllCarts } = require("../controllers/adminController");

router.get("/all-carts", adminMiddleware, getAllCarts);

module.exports = router;
