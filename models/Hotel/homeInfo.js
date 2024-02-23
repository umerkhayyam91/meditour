const mongoose = require("mongoose");
const homeInfoSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  guestBook: {
    type: String,
    enum: ["entire place", "a private room"],
  },
  similarPropertyCategory: {
    type: String,
    enum: [
      "appartmen ",
      "holiday home",
      "Villa",
      "aparthotel",
      "chalet",
      "holiday park",
    ],
  },
  propertyName: {
    type: String,
    required: true,
  },
  starRating: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  partOfCompany: {
    type: String,
    enum: ["yes", "No"],
    required: true,
  },
  nameOfCompany: {
    type: String,
    required: true,
  },
  channelManager: {
    type: String,
    enum: ["I use a channel manager", "I don't use a channel manager"],
  },
  nameOfManager: {
    type: String,
    required: true,
  },
  appartmentsNo: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
    required: true,
  },
  numberOfBedroom: {
    type: String,
    required: true,
  },
  numberOfLivingroom: {
    type: String,
    required: true,
  },
  numberOfBathroom: {
    type: String,
    required: true,
  },
  numberOfRooms: {
    type: String,
    required: true,
  },
  beds: [{
    bedKind: {
      type: String,
      required: true,
    },
    noOfBeds: {
      type: String,
      required: true,
    }
  }],
  noOfStayingGuests: {
    type: String,
    required: true,
  },
  privateBathroom: {
    type: String,
    required: true,
  },
  numberOfSofaBed: {
    type: String,
    required: true,
  },
  guest: {
    type: String,
    required: true,
  },
  appartmentSize: {
    type: String,
  },
  basePricePerNight: {
    type: String,
  },
  isParkingAvailable: {
    type: String,
    required: true,
  },
  privateParking: {
    type: String,
    enum: ["Private", "Public"],
  },
  siteParking: {
    type: String,
    enum: ["onsite", "offsite"],
  },
  reservation: {
    type: String,
    enum: ["Reservation Needed", "No Reservation Needed"],
  },
  priceOfParking: {
    type: String,
  },
  language: {
    type: String,
    required: true,
  },
  facillities: [{
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
    ],
  }],
  extraBed: {
    type: String,
    enum: ["yes", "no"],
  },
  propertyphoto: {
    type: String,
    required: true,
  },
  advanceCancelfreeofCharge: {
    type: String,
    required: true,
  },
  accidentalBookingPolicy: {
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
  smoking: {
    type: Boolean,
    required: true
  },
  accomodateChildren: {
    type: Boolean,
    required: true
  },
  pets: {
    type: String,
    enum: ["Yes", "No"],
  },
  chargesOfPets: {
    type: String,
    required: true,
  },
  minimumStay: {
    type: String,
    required: true,
  },
  selectedNumberOfBed: {
    type: String,
    required: true,
  },
  extraBedAccomodateGuest: {
    type: String,
    enum: ["Children upyo 2 years old in cribs", "Children", "Adults"],
  },
});

module.exports = mongoose.model("HomeInfo", homeInfoSchema, "homes");
