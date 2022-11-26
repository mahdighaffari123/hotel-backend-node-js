const express = require("express");
const blogController = require("../controller/blogController");
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
const reviewRouter = require("../routes/reviewRoutes");
const router = express.Router();

router.route("/:id").get(blogController.getBlog);

router.use(authController.protect);

router.use(reviewController.setBlogUserIds);

router.use("/:parentId/reviews", reviewRouter);

router.use(authController.restrictTo("admin"));

router.get("/", blogController.getAllBlogs);

router.post(
  "/create",
  blogController.uploadBlogPhoto,
  blogController.resizeBlogPhoto,
  blogController.setBlogUserIds,
  blogController.createBlog
);

router
  .route("/:id")
  .post(blogController.updateBlog)
  .delete(blogController.deleteBlog);

// router.route("/:parentId/reviews").post(reviewController.createReview);
module.exports = router;
