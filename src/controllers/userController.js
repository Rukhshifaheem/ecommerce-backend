const { v4: uuidv4 } = require('uuid');
const User = require("../models/user.js");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) 
            return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let cartData = {};
            for (let i = 0; i < 300; i++) {
            cartData[i] = 0;
        }

        // Create new user
        const user = new User({ name, email, password: hashedPassword, cartData });
        await user.save();

        const token = jwt.sign({ id: user._id, name, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: "Error registering user", error });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get the current authenticated user
const getUser = async (req, res) => {
    try {
        // Get the user ID from the token (added by the authenticateToken middleware)
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude the password from the result

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { register, login, getUser };