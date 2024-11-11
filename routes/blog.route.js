const express = require("express");
const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getMyBlogs,
  getSingleBlogs,
  updateBlog,
} = require("../controller/blog.controller");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Create a new blog (admin only)
router.post("/create", authenticateUser, authorizeRoles("admin"), createBlog);

// Delete a blog (admin only)
router.delete("/delete/:id", authenticateUser, authorizeRoles("admin"), deleteBlog);

// Get all blogs (accessible to everyone)
router.get("/all-blogs", getAllBlogs);

// Get a single blog (accessible to authenticated users)
router.get("/single-blog/:id", authenticateUser, getSingleBlogs);

// Get blogs created by the authenticated user (admin only)
router.get("/my-blog", authenticateUser, authorizeRoles("admin"), getMyBlogs);

// Update a blog (admin only)
router.put("/update/:id", authenticateUser, authorizeRoles("admin"), updateBlog);

module.exports = router;
