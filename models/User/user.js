const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true  },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  mrNo: { type: String, required: true },
  phone: { type: String, required: true },
  userImage: { type: String, required: true },
  password: { type: String, required: true },
  favouriteLabs: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Laboratory',
    default: []
  }],
  favouritePharmacies: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pharmacy',
    default: []
  }],
});

module.exports = mongoose.model("Users", userSchema, "Users");
