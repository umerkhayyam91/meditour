const mongoose = require("mongoose");

const { Schema } = mongoose;

const verificationCodeSchema = new Schema(
  {
    _userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    code: { type: String, required: true },
    // expireAt: { type: Date, default: Date.now, index: { expires: 120000 } },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 120, // Expires the document after 120 seconds (2 minutes)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "VerificationCode",
  verificationCodeSchema,
  "verificationCodes"
);
