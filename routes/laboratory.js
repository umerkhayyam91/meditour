const express = require("express");
const labAuthController = require("../controller/Laboratory/labAuthController");
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const bodyParser = require("body-parser");
// const auth = require("../middlewares/auth");

const router = express.Router();
const upload = multer({ dest: "temp/" });
// register
router.post("/lab/register", labAuthController.register);
router.post("/lab/login", labAuthController.login);
router.post("/lab/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.get("/lab/getOrders", labAuthController.getOrders);
router.put("/lab/changeStatus", labAuthController.changeStatus);

// router.post("/logout", auth, authController.logout);

module.exports = router;
