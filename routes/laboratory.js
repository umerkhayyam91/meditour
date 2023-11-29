const express = require("express");
const labAuthController = require("../controller/Laboratory/labAuthController");
const labOrderController = require("../controller/Laboratory/labOrderController");
const labTestController = require("../controller/Laboratory/labTestController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });

//............auth...........
router.post("/lab/register", labAuthController.register);
router.post("/lab/login", labAuthController.login);
router.post("/lab/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/lab/completeSignup", labAuthController.completeSignup);
router.put("/lab/updateProfile", auth, labAuthController.updateProfile);
router.post("/lab/logout", auth, labAuthController.logout);
router.post("/lab/refresh", auth, labAuthController.refresh);


//.....Orders................
router.get("/lab/getOrders", auth, labOrderController.getOrders);
router.put("/lab/changeStatus", auth, labOrderController.changeStatus);
router.get("/lab/dashDetails", auth, labOrderController.dashDetails);
router.get("/lab/graph", auth, labOrderController.graph);


//.....Tests................
router.post("/lab/addTest", auth, labTestController.addTest);
router.put("/lab/editTest", auth, labTestController.editTest);
router.delete("/lab/deleteTest", auth, labTestController.deleteTest);
router.get("/lab/getTest", auth, labTestController.getTest);
router.get("/lab/getAllTests", auth, labTestController.getAllTests);


//..............verification.........
router.post("/lab/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/lab/confirmEmail", VerificationController.confirmEmail);

// router.post("/logout", auth, authController.logout);

module.exports = router;
