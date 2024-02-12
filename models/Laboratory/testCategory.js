const mongoose = require("mongoose");

const testCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TestCategory",
  testCategorySchema,
  "testcategory"
);
