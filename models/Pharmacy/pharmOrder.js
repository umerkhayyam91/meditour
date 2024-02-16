const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    pharmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    medicines: [
      {
        medId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        quantity: {
          type: Number,
          default: 1, // Default quantity if not specified
        },
      },
    ],
    preference: {
      type: String,
      enum: ["labVisit", "homeSample"],
    },
    currentLocation: {
      type: String,
    },
    prescription: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    MR_NO: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inProcess", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PharmOrder", orderSchema, "pharmacy orders");
