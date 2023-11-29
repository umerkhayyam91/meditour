const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  medCode: {
    type: String,
    required: true,
  },
  pharmId: {
    type: String,
    required: true,
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
    required: true,
  },
  totalAmount:{
    type: Number,
    required: true
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model("PharmOrder", orderSchema, "pharmacy orders");
