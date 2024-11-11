const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/user.route');
const blogRoute = require('./routes/blog.route');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// CORS Configuration
// CORS Configuration
app.use(
    cors({
      origin: 'http://localhost:5173', // Correctly specify your frontend URL without trailing slash
      credentials: true, // If you need to include cookies or authorization headers
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  

// Logging Middleware for Debugging
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`Response Status: ${res.statusCode}`);
    });
    next();
});

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

// MongoDB Connection
mongoose.connect(process.env.MONOG_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));

// Routes
app.use('/api/users', userRoutes);
app.use("/api/blogs", blogRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
