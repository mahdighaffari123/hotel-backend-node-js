const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");
router.post("/login", authController.login);

router.post("/signUp", authController.signUp);

router.post("/forgotPassword", authController.forgotPassword);

router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.post("/updatePassword", authController.updatePassword);

router.post(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.post("/deleteMe", userController.deleteMe);

router.get("/me", userController.setId, userController.getUser);

router.use(authController.restrictTo("admin"));

router.get("/", userController.getAllUsers);

router.post("/createUser", userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .post(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
