const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },
    like: Boolean,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    parentId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please provide parentId"],
    },
    catType: {
      type: String,
      required: [true, "Please provide catType"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "f_name l_name photo",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
