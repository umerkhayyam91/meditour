const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referringDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  referredDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  referralDate: {
    type: Date,
    default: Date.now,
  },
  additionalInfo: String,
},
{
    timestamps: true,
}
);

const Referral = mongoose.model("Referral", referralSchema, "referrals");

module.exports = Referral;
