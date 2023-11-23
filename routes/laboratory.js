const express = require("express");
const labAuthController = require("../controller/Laboratory/labAuthController");
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const bodyParser = require("body-parser");
// const auth = require("../middlewares/auth");

const router = express.Router();
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "gs://meditour-33ba8.appspot.com",
//   });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// register
router.post("/lab/register", labAuthController.register);
router.post("/lab/login", labAuthController.login);
router.post("/labLogo", upload.single("image"), labAuthController.labLogo);

// router.post("/logout", auth, authController.logout);

module.exports = router;
