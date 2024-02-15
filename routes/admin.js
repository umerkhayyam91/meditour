const express = require("express");
const auth = require("../middlewares/auth");
const multer = require("multer");
const adminLabController = require("../controller/Admin/adminLabController");
const router = express.Router();

//............Lab...............
router.post("/admin/addTestCategory", adminLabController.addTestCategory);
router.delete("/admin/deleteTest", adminLabController.deleteTest);


router.get(
  "/admin/getAllTestCategories",
  adminLabController.getAllTestCategory
);

module.exports = router;
