const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import routes
const productRoutes = require('./src/routes/productRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const cartRoutes = require("./src/routes/cartRoutes.js");
const adminRoutes = require("./src/routes/adminRoutes.js");

const app = express();
const port = 3000;

// CORS Configuration with multiple allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  credentials: true, // Allow cookies or credentials to be shared
}));

// Middleware
app.use(express.json({ limit: "100mb" })); 
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './upload/images');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  const now = new Date();
  res.send(`Current Date and Time: ${now.toLocaleString()}`);
});

// Image upload route
app.use('/upload', express.static('upload/images'));
app.post('/upload', upload.single('product'), (req, res) => {
  console.log(req.file);
  res.send(`/${req.file.path}`);
});

// Use product, user, cart, and admin routes
app.use('/product', productRoutes);
app.use('/user', userRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
