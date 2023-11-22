const express = require("express");
const authController = require("../controller/authController");
const auth = require("../middlewares/auth");

const router = express.Router();

// user

// register
router.post("/register", authController.register);

//Verify Email
router.post("/verifyEmail", authController.confirmEmail);

// login
router.post("/login", authController.login);

// logout
router.post("/logout", auth, authController.logout);

// refresh
router.get("/refresh", authController.refresh);

module.exports = router;
