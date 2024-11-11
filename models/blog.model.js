const mongoose = require("mongoose"); // Changed import to require
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  blogImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minlength: [20, "Should contain at least 200 characters!"],
  },
  adminName: {
    type: String,
  },
  adminPhoto: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Blog = mongoose.model("Blog", blogSchema); // Changed export syntax

module.exports = Blog; // Export using CommonJS syntax
