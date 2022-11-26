const express = require("express");
const hotelController = require("../controller/hotelController");
const authController = require("../controller/authController");
const reviewRouter = require("../routes/reviewRoutes");
const router = express.Router();

router.get("/:id", hotelController.getHotel);

router.use(authController.protect);

router.use(hotelController.setHotelUserIds);

router.use("/:parentId/reviews", reviewRouter);

router.use(authController.restrictTo("admin"));

router.get("/", hotelController.getAllHotels);

router.post(
  "/createHotel",
  hotelController.uploadHotelImages,
  hotelController.resizeHotelImages,
  hotelController.setHotelUserIds,
  hotelController.createHotel
);

router
  .route("/:id")
  .post(
    hotelController.uploadHotelImages,
    hotelController.resizeHotelImages,
    hotelController.updateHotel
  )
  .delete(hotelController.deleteHotel);

module.exports = router;
