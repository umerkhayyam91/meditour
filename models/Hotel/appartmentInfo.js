const mongoose = require("mongoose");
const appartmentInfoSchema= new mongoose.Schema(
    {
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
          required: true
        },
        customName:{
          type: String,
          required: true,

        },
        contactNumber: {
          type: String,
          required: true,
        },
        streetAddress:{
          type: String,
          required: true,

        },
        addressLine2:{
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
        propertyOwnership: {
          type: String,
          enum: ["rented", "owned"],
          required: true,
        },
         channelManager: {
          type: String,
          enum: ["I use a channel manager", "I don't use a channel manager"],
        },
        nameOfCompany:{
          type: String,
          required: true,
        },
        nameOfManager:{
          type: String,
          required: true,
        },
        numberOfBedroom:{
          type: String,
          required: true,
        },
        numberOfLivingroom:{
          type: String,
          required: true,
        },
        numberOfBathroom:{
          type: String,
          required: true,
        },
        numberOfAppartments:{
          type: String,
          required: true,
        },
        TypeOfAppartments:{
          type: String,
          required: true,

        },
        KindOfBeds:{
          type: String,
          required: true,

        },
        numberOfBed:{
          type: String,
          required: true,
        },
        addAnotherBed:{
          type: String,
          required: true,
        },
        noOfStayingGuests:{
          type: String,
          required: true,
        },
        privateBathroom:{
          type:Boolean,
          required: true
        },
        numberOfSofaBed:{
          type: String,
          required: true,
        },
        guest:{
          type: String,
          required: true,
        },
        appartmentSize:{
          type: String,
        },
        basePricePerNight:{
          type: String,
   
        },
        isParkingAvailable:{
          type: String,
          required: true,
        },
        parkingtype:{
          type: String,
          enum: ["Private", "Public"]
        },
        siteParking:{
          type: String,
          enum: ["onsite", "offsite"]
        },
        reservation:{
          type: String,
          enum: ["Reservation Needed", "No Reservation Needed"]

        },
        priceOfParking:{
          type: String,
          
          
        },
        breakfast:{
          type: String,
          required: true,
        },
        priceOfBreakfast:{
          type: String,
          enum: ["No", "yes, it's included in the price", "yes, its optional"]
        },
        kindOfBreakfast:{
          type: String,
          enum: ["Continental", "American", "Buffet", "A la carte", "Breakfast to go","italian","Full English/Irish","Vegetarian"]
        },
        language:{
          type: String,
          required: true,
        },
        facillities:{
          type: String,
          enum: ["Free Wifi", "Bar", "Non-smoking rooms","Sauna","Hottub/Jacuzzi","Garden","Air Conditiong","Terrace","Swimming Pool", "Gym","Madrassah","Mosque","Water Park"],

        },
      extraBed:{
        type: String,
        enum: ["yes", "no"]
      },
      selectedNumberOfBed:{
        type: String,
        required: true,
      },
      extraBedAccomodateGuest:{
        type: String,
        enum: ["Children upyo 2 years old in cribs", "Children","Adults"]
      },
      Amenities:{

        type: String,
        required: true,
        

      },
    propertyphoto:{
      type: String,
      required: true,
      

    },
    advanceCancelfreeofCharge:{
      type: String,
      required: true,
      
    },
    CheckInForm:{
      type: String,
      required: true,
      

    },
    CheckOutForm:{
      type: String,
      required: true,
    
      

    },
    smoking:{
      type: String,
      enum: ["Yes", "No"],
      
    },
    AccomodateChildren:{
      type: String,
      enum: ["Yes", "No"],
    },
  minimumStay:{
    type: String,
    required: true,

  },
  pets:{
    type: String,
    enum: ["Yes", "No"],

  },
  chargesOfPets:{
    type: String,
    required: true,
  },
        
      }

    );



module.exports= mongoose.model("AppartmentInfo" , appartmentInfoSchema, "appartments info")