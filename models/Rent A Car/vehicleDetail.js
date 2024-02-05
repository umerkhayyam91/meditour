const mongoose= require("mongoose");

const vehicleDetailSchema= new mongoose.Schema(
  {

    rentACarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rent A Car",
    },
    vehicleType: {
        type: String,
      },
      vehicleName: {
        type: String,
      },
      vehicleModel: {
        type: String,
      },
       vehicleYear: {
        type: String,
      },
      vehicleColour: {
        type: String,
      }, 
      vehicleVinNo: {
        type: String,
      },
      vehicleRegisterationNo: {
        type: String,
      },
      vehicleRegisterationDate: {
        type: String,
      },
     actualPricePerHour: {
        type: String,
      },
      meditourPricePerHour: {
        type: String,
      },


})
module.exports=mongoose.model("Vehicle Detail", vehicleDetailSchema, "vehicle details")