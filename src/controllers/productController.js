const { v4: uuidv4 } = require('uuid');
const Product = require("../models/product.js");

// Get all products
const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get new collection

const getNewCollection = async (req, res) => {
    try {
        let products = await Product.find({});
        let newCollection = products.slice(1).slice(-8);
        res.send(newCollection);
    } catch (error) {
        res.status(500).json({ message: error})
    }
}

// Get popular in women section

const getPopularInWomen = async (req, res) => {
    try {
        let products = await Product.find({category:"women"});
        let popularInWomen = products.slice(0, 4);
        res.send(popularInWomen);
    } catch (error) {
        res.status(500).json({ message: error})
    }
}

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, image, category, new_price, old_price, available } = req.body;

        const newProduct = new Product({
            name,
            image,
            category,
            new_price,
            old_price,
            available
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error adding product", error });
    }
};


// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } else {
            const { name, image, category, new_price, old_price, available } = req.body;
            await Product.updateOne({ _id: id }, { name, image, category, new_price, old_price, available });
            res.status(200).json({ message: "Product updated" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};



// Delete a product
const deleteProduct = async (req, res) => {
     try {
        const { id } = req.params;
        const product = await Product
            .findOne({ id }); // Find the product
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } else { // Delete the product
            await Product.deleteOne({ id });
            res.status(200).json({ message: "Product deleted" });
        } 
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

// Export the functions
module.exports = { 
    getAllProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    getNewCollection,
    getPopularInWomen
};
