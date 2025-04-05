const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const authMiddleware = require('../middleware/authMiddleware.js'); // Ensure the correct path

router.get('/allProducts', productController.getAllProducts);
router.post('/addProduct', authMiddleware, productController.addProduct);
router.delete('/deleteProduct/:id', authMiddleware, productController.deleteProduct);
router.put('/updateProduct/:id', authMiddleware, productController.updateProduct);
router.get('/newCollection', productController.getNewCollection);
router.get('/popularInWomen', productController.getPopularInWomen);

module.exports = router;
