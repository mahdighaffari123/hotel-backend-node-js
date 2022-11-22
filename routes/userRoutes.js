const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/login", authController.login);

router.post("/signUp", authController.signUp);

router.post("/forgotPassword", authController.forgotPassword);

router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.post("/updatePassword", authController.updatePassword);

module.exports = router;
