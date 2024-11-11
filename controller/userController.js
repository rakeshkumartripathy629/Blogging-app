const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user.model.js'); // Ensure User model is required
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ message: "User photo is required" });
        }

        const { photo } = req.files;

        // Validate photo format
        const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedFormats.includes(photo.mimetype)) {
            return res.status(400).json({
                message: "Invalid photo format. Only jpg, png, and webp are allowed",
            });
        }

        // Extract user details from request body
        const { email, name, password, phone, role, education } = req.body;

        // Check for all required fields
        if (!email || !name || !password || !phone || !role || !education) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Upload photo to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(500).json({ message: "Error uploading photo to Cloudinary" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with role and education
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            phone,
            role,
            education,
            photo: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
        });

        // Save the new user
        await newUser.save();

        // Respond with success message and user data
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                education: newUser.education,
                photo: newUser.photo.url,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login User
// exports.login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body; // Destructure role from the request body

//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Check if provided role matches the user's role in the database
//         if (user.role !== role) {
//             return res.status(403).json({ message: 'Role mismatch. Access denied.' });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         // Create a JWT token and include role
//         const token = jwt.sign(
//             { id: user._id, email: user.email, role: user.role },
//             'your_secret_key', // replace with your own secret key
//             { expiresIn: '1h' }
//         );

//         // Set token in cookie with an expiration of 999 days
//         const maxAge = 999 * 24 * 60 * 60 * 1000; // 999 days in milliseconds
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // use secure cookies in production
//             maxAge, // 999 days
//         });

//         res.status(200).json({
//             message: 'Login successful',
//             user: { email: user.email, phone: user.phone, role: user.role, photo: user.photo.url },
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if provided role matches the user's role in the database
        if (user.role !== role) {
            return res.status(403).json({ message: 'Role mismatch. Access denied.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token and include role
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            'your_secret_key', // replace with your own secret key
            { expiresIn: '1h' }
        );

        // Log the token to the console
        console.log('Generated Token:', token);

        // Save the token in the database
        user.token = token;
        await user.save();

        // Set token in cookie with an expiration of 999 days
        const maxAge = 999 * 24 * 60 * 60 * 1000; // 999 days in milliseconds
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            maxAge, // 999 days
        });

        res.status(200).json({
            message: 'Login successful',
            user: { email: user.email, phone: user.phone, role: user.role, photo: user.photo.url },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports . getMyProfile = async (req, res) => {
    const user = await req.user;
    res.status(200).json({ user });
  };

  exports . getAdmins = async (req, res) => {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  };
  
// Logout User
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
