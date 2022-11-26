const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide blog name"],
    },
    like: {
      type: Boolean,
    },
    photo: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please provide blog description"],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please provide user for this blog"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "parentId",
  localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "f_name l_name email",
  });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
