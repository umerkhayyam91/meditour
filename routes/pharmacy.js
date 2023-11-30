const express = require("express");
const pharmAuthController = require("../controller/Pharmacy/pharmAuthController");
const pharmMedController = require("../controller/Pharmacy/pharmMedController");
const pharmOrderController = require("../controller/Pharmacy/pharmOrderController");
const labTestController = require("../controller/Laboratory/labTestController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/pharm/register", pharmAuthController.register);
router.post("/pharm/login", pharmAuthController.login);
router.post("/pharm/completeSignup", pharmAuthController.completeSignup);
router.put("/pharm/updateProfile", auth, pharmAuthController.updateProfile);
router.post("/pharm/logout", auth, pharmAuthController.logout);
router.post("/pharm/refresh", auth, pharmAuthController.refresh);

//............medicine............
router.post("/pharm/addMed", auth, pharmMedController.addMed)
router.put("/pharm/editMed", auth, pharmMedController.editMed)
router.delete("/pharm/deleteMed", auth, pharmMedController.deleteMed)
router.get("/pharm/getMed", auth, pharmMedController.getMed)
router.get("/pharm/getAllMeds", auth, pharmMedController.getAllMeds)

//............orders................
router.get("/pharm/getOrders", auth, pharmOrderController.getOrders)
router.put("/pharm/changeStatus", auth, pharmOrderController.changeStatus)
router.get("/pharm/dashDetails", auth, pharmOrderController.dashDetails)
router.get("/pharm/graph", auth, pharmOrderController.graph)


//..............verification.........
router.post("/pharm/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/pharm/confirmEmail", VerificationController.confirmEmail);

module.exports = router;
