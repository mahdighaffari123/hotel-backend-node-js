const express = require("express");
const hotelController = require("../controller/hotelController");
const authController = require("../controller/authController");
const router = express.Router();

router.get("/", hotelController.getAllHotels);

router.get("/:id", hotelController.getHotel);

// Check if user is logged in
router.use(authController.protect);

// Check if the user role is admin
router.use(authController.restrictTo("admin"));

router.post("/createHotel", hotelController.createHotel);

router
  .route("/:id")
  .post(hotelController.updateHotel)
  .delete(hotelController.deleteHotel);

module.exports = router;
