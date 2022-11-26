const express = require("express");
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

const setIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.parentId) req.body.parentId = req.params.parentId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

router.post("/", setIds, reviewController.createReview);

router.use(authController.restrictTo("admin"));

router.route("/").get(reviewController.getAllReviews);

router
  .route("/:id")
  .post(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
