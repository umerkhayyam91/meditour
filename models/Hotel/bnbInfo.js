const mongoose = require("mongoose");
const bnbInfoSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  propertyName: {
    type: String,
    required: true,
  },
  starRating: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  alternativeContactNo: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  propertyAddress: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
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
  noOfAllRooms: {
    type: String,
    required: true,
  },
  bedKinds: {
    type: String,
    required: true,
  },
  bedNo: {
    type: String,
    required: true,
  },
  guestNo: {
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
  parkingAvailability: {
    type: String,
    required: true,
  },
  parkingPrice: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  facillities: {
    type: String,
    enum: [
      "Free Wifi",
      "Bar",
      "Non-smoking rooms",
      "Sauna",
      "Hottub/Jacuzzi",
      "Garden",
      "Airport Shuttle",
      "Terrace",
      "Swimming Pool",
      "Gym",
      "Madrassah",
      "Mosque",
      "Water Park",
    ],
  },
  extraBed: {
    type: String,
    enum: ["yes", "No"],
  },
  addExtraBed: {
    type: String,
  },
  guestsInExtraBeds: {
    type: String,
    enum: ["Children upyo 2 years old in cribs", "Children", "Adults"],
  },
  amenities: {
    type: String,
    required: true,
    enum: [
      "Air Conditiong ",
      "Bath Tub",
      "Spa Tub",
      "Flat Screen Tv",
      "Electric Kettle",
      "Balcony",
      "Terrace",
      "All Rooms",
      "Some Room",
    ],
  },
  propertyphoto: {
    type: String,
    required: true,
  },
  advanceCancelfreeofCharge: {
    type: String,
    required: true,
  },
  checkInForm: {
    type: String,
    required: true,
  },
  checkOutForm: {
    type: String,
    required: true,
  },

  accomodateChildren: {
    type: String,
    enum: ["Yes", "No"],
  },

  pets: {
    type: String,
    enum: ["Yes", "No"],
  },
  chargesOfPets: {
    type: String,
    required: true,
  },
  addAnotherProperty: {
    type: String,
 
  },
});


module.exports= mongoose.model("bnbInfo" , bnbInfoSchema, "bnb info")
