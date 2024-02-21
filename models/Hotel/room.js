const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema({
  bnbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotels And Bnb",
  },
  roomType: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  smokingPolicy: {
    type: String,
    required: true,
  },
  noOfRooms: {
    type: Number,
    required: true,
  },
  bedKinds: {
    type: String,
    required: true,
  },
  noOfBeds: {
    type: String,
    required: true,
  },
  noOfGuestsStay: {
    type: String,
    required: true,
  },
  roomSize: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: String,
    required: true,
  },
  priceForMeditour: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Hotel Room", roomSchema, "hotel rooms");
