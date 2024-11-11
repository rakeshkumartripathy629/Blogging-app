const mongoose = require("mongoose"); // Changed import to require
const Blog = require("../models/blog.model"); // Changed import to require
const cloudinary = require("cloudinary").v2; // Changed import to require

exports . createBlog = async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Blog Image is required" });
      }
      const { blogImage } = req.files;
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(blogImage.mimetype)) {
        return res.status(400).json({
          message: "Invalid photo format. Only jpg and png are allowed",
        });
      }
      const { title, category, about } = req.body;
      if (!title || !category || !about) {
        return res
          .status(400)
          .json({ message: "title, category & about are required fields" });
      }
      const adminName = req?.user?.name;
      const adminPhoto = req?.user?.photo?.url;
      const createdBy = req?.user?._id;
  
      const cloudinaryResponse = await cloudinary.uploader.upload(
        blogImage.tempFilePath
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log(cloudinaryResponse.error);
      }
      const blogData = {
        title,
        about,
        category,
        adminName,
        adminPhoto,
        createdBy,
        blogImage: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.url,
        },
      };
      const blog = await Blog.create(blogData);
  
      res.status(201).json({
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server error" });
    }
  };
  
// Delete Blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find();
  res.status(200).json(allBlogs);
};

// Get Single Blog
exports.getSingleBlogs = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(blog);
};

// Get My Blogs
exports.getMyBlogs = async (req, res) => {
  const createdBy = req.user._id;
  const myBlogs = await Blog.find({ createdBy });
  res.status(200).json(myBlogs);
};

// Update Blog
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(updatedBlog);
};
