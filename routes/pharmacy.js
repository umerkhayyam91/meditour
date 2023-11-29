const express = require("express");
const pharmAuthController = require("../controller/Pharmacy/pharmAuthController");
const pharmMedController = require("../controller/Pharmacy/pharmMedController");
const labOrderController = require("../controller/Laboratory/labOrderController");
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
router.post("/pharm/verify", pharmAuthController.verify);
router.post("/pharm/updateProfile", auth, pharmAuthController.updateProfile);

//............medicine............
router.post("/pharm/addMed", auth, pharmMedController.addMed)
router.put("/pharm/editMed", auth, pharmMedController.editMed)
router.delete("/pharm/deleteMed", auth, pharmMedController.deleteMed)
router.get("/pharm/getMed", auth, pharmMedController.getMed)
router.get("/pharm/getAllMeds", auth, pharmMedController.getAllMeds)

module.exports = router;
