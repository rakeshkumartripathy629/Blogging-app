const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js'); // Ensure User model is required

// Middleware to authenticate a user based on JWT token
exports.authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with the actual secret

        // Find the user based on the token payload
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token or session expired" });
    }
};

// Middleware to authorize users based on role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};
