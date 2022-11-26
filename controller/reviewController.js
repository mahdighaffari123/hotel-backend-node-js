const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");

exports.setBlogUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.catType) req.body.catType = "BlogReview";
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
