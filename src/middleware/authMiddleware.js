const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied: No Token Provided or Invalid Format" });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
