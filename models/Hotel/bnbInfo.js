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
  roomIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel Room",
  }],
  parkingAvailability: {
    type: Boolean,
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
  facilities: [{
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
  }],  
  extraBedAvailability: {
    type: Boolean,
    required: true,
  },
  noOfExtraBeds: {
    type: String,
  },
  guestsInExtraBeds: [{
    type: String,
    enum: ["Children upto 2 years old in cribs", "Children", "Adults"],
  }],
  amenities: [{
    type: String,
    required: true,
    enum: [
      "Air Conditioning",
      "Bath Tub",
      "Spa Tub",
      "Flat Screen TV",
      "Electric Kettle",
      "Balcony",
      "Terrace",
      "All Rooms",
      "Some Room",
    ],
  }],
  propertyphotos: [{
    type: String,
    required: true,
  }],
  advanceCancelfreeofCharge: {
    type: String,
    required: true,
  },
  checkInFrom: {
    type: String,
    required: true,
  },
  checkInTo: {
    type: String,
    required: true,
  },
  checkOutFrom: {
    type: String,
    required: true,
  },
  checkOutTo: {
    type: String,
    required: true,
  },
  accomodateChildren: {
    type: Boolean,
    required: true,
  },
  pets: {
    type: Boolean,
    required: true,
  },
  chargesOfPets: {
    type: String,
    enum: ["free", "charge"],
  },
});


module.exports= mongoose.model("Hotels And Bnb" , bnbInfoSchema, "hotels and bnbs")
