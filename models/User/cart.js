const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1, adjust as needed
  },
});

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  cartItems: [cartItemSchema],
});

module.exports = mongoose.model("PharmacyCart", cartSchema, "pharmacy carts");
