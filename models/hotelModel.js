const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide hotel name"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Please provide hotel address"],
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 1,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: [true, "Please provide an image for hotel main image"],
    },
    images: [String],
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return (val / 100) * this.price < this.price;
        },
        message: "Discount percent should be below regular price",
      },
    },
    like: {
      type: Boolean,
      default: false,
    },
    numberOfRooms: {
      type: Number,
      required: [true, "Please enter the number of rooms"],
    },
    numberOfFloors: {
      type: Number,
      required: [true, "Please enter the number of floors"],
    },
    description: {
      type: String,
      required: [true, "Please enter the hotel description"],
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

hotelSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "parentId",
  localField: "_id",
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
