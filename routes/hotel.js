const express = require("express");
const hotelAuthController = require("../controller/Hotel/hotelAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const appartmentInfoController = require("../controller/Hotel/appartmentInfoController");
const BnbInfoController = require("../controller/Hotel/bnbInfoController");
const BnbRoomController = require("../controller/Hotel/hotelRoomController");
const homeInfoController = require("../controller/Hotel/homeInfoController");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/hotel/register", hotelAuthController.register);
router.post("/hotel/login", hotelAuthController.login);
router.post("/hotel/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/hotel/completeSignup", hotelAuthController.completeSignup);
router.put("/hotel/updateProfile", auth, hotelAuthController.updateProfile);
router.post("/hotel/logout", auth, hotelAuthController.logout);
router.post("/hotel/refresh", auth, hotelAuthController.refresh);


//..............verification.........
router.post("/hotel/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/hotel/confirmEmail", VerificationController.confirmEmail);
router.post("/hotel/ResetLink", VerificationController.ResetLink);
router.post("/hotel/resetPassword", VerificationController.resetPassword);

// ....appointment crud..//

router.post("/hotel/addAppartment", auth, appartmentInfoController.addAppartment);
router.put("/hotel/editAppartment",auth, appartmentInfoController.editAppartment);
router.delete("/hotel/deleteAppartment",auth, appartmentInfoController.deleteAppartment);
router.get("/hotel/getAppartment",auth, appartmentInfoController.getAppartment);
router.get("/hotel/getAllAppartments",auth, appartmentInfoController.getAllAppartments);


// ..B&B CRUD...//
router.post("/hotel/addBnb", auth, BnbInfoController.addBnb);
router.put("/hotel/updateBnb",auth, BnbInfoController.updateBnb);
router.delete("/hotel/deleteBnb",auth, BnbInfoController.deleteBnb);
router.get("/hotel/getBnb",auth, BnbInfoController.getBnb);
router.get("/hotel/getAllBnb",auth, BnbInfoController.getAllBnb);

//..........B$B Rooms...................//
router.post("/hotel/addRoom",auth, BnbRoomController.addRoom);
router.put("/hotel/editRoom",auth, BnbRoomController.editRoom);
router.delete("/hotel/deleteRoom",auth, BnbRoomController.deleteRoom);
router.get("/hotel/getRoom",auth, BnbRoomController.getRoom);
router.get("/hotel/getAllRoom",auth, BnbRoomController.getAllRoom);


// ..HOME CRUD...//
router.post("/hotel/addHome", auth, homeInfoController.addHome);
router.put("/hotel/editHome",auth, homeInfoController.editHome);
router.delete("/hotel/deleteHome",auth, homeInfoController.deleteHome);
router.get("/hotel/getHome",auth, homeInfoController.getHome);
router.get("/hotel/getAllHomes",auth, homeInfoController.getAllHomes);



module.exports = router;
 