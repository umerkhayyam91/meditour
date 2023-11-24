const express = require("express");
const labAuthController = require("../controller/Laboratory/labAuthController");
const labTestController = require("../controller/Laboratory/labTestController");
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");

const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });

// register
router.post("/lab/register", labAuthController.register);
router.post("/lab/login", labAuthController.login);
router.post("/lab/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.get("/lab/getOrders", labAuthController.getOrders);
router.put("/lab/changeStatus", labAuthController.changeStatus);

//.....Tests................
router.post("/lab/addtest", labTestController.addTest);

// router.post("/logout", auth, authController.logout);

module.exports = router;
