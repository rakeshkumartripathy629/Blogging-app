// // models/user.model.js
// const mongoose = require('mongoose');

// // Define the user schema
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true, // This field is required
//   },
//   email: {
//     type: String,
//     required: true, // This field is required
//     unique: true, // Ensure email is unique
//     trim: true, // Remove whitespace from both ends
//     lowercase: true, // Convert to lowercase
//   },
  
//   password: {
//     type: String,
//     required: true, // This field is required
//   },
//   phone: {
//     type: String,
//     required: true, // This field is required
//   },
//   // education: {
//   //   type: String,
//   //   required: true, // This field is required
//   // },
//   // role: {
//   //   type: String,
//   //   required: true, // This field is required
//   //   enum: ['user', 'admin'], // Example roles, adjust as necessary
//   // },
//   photo: {
//     url: {
//       type: String,
//       required: true, // This field is required
//     },
//     public_id: {
//       type: String,
//       required: true, // This field is required
//     },
//   },
// });

// // Create User model
// const User = mongoose.model('User', userSchema);

// module.exports = User;



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Adjust roles as needed
        default: 'user',
    },
    education: {
        type: String,
        required: true,
        trim: true,
    },
    photo: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        token: { type: String },
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
