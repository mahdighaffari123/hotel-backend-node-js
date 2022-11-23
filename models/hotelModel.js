const mongoose = require("mongoose");
const validator = require("validator");
const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide hotel name"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please provide hotel address"],
  },
  rating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
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
});
