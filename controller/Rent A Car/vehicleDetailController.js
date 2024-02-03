const express= require("express");
const Joi = require("joi");
const vehicleDetailDTO = require("../../dto/vehicleDetail");
const vehicleDetail= require("../../models/Rent A Car/vehicleDetail")
const app= express();



const vehicleDetailController={

 async addVehicle(req,res,next){

const vehicleDetailSchema=Joi.object({

    vehicleType: Joi.string(),
    vehicleName: Joi.string(),
    vehicleModel:Joi.string(),
    vehicleYear:Joi.string(),
    vehicleColour:Joi.string(),
    vehicleVinNo:Joi.string(),
    vehicleRegisterationNo:Joi.string(),
    vehicleRegisterationDate:Joi.string(),
    actualPricePerHour:Joi.string(),
    meditourPricePerHour:Joi.string(),
});
const{error}=vehicleDetailSchema.validate(req.body);

if(error){
    return next (error)
}
const vehicleCompanyId = req.user._id;

const
{
 
    vehicleType,
    vehicleName,
    vehicleModel,
    vehicleYear,
    vehicleColour,
    vehicleVinNo,
    vehicleRegisterationNo,
    vehicleRegisterationDate,
    actualPricePerHour,
    meditourPricePerHour

}=req.body

let vehicle;
const rentACarId = req.user._id;

try {
  const vehicleToRegister = new vehicleDetail({
    rentACarId,
    vehicleType,
    vehicleName,
    vehicleModel,
    vehicleYear,
    vehicleColour,
    vehicleVinNo,
    vehicleRegisterationNo,
    vehicleRegisterationDate,
    actualPricePerHour,
    meditourPricePerHour,
  });

  vehicle = await vehicleToRegister.save();
} catch (error) {
  return next(error);
}
console.log(vehicle);
const vehicleDetailDto = new vehicleDetailDTO(vehicle);
console.log(vehicleDetailDTO);

return res.status(201).json({ Vehicle: vehicleDetailDto, auth: true });
},



async editVehicle(req, res, next) {
  const vehicleDetailSchema = Joi.object({
    vehicleType: Joi.string(),
    vehicleName: Joi.string(),
    vehicleModel: Joi.string(),
    vehicleYear: Joi.string(),
    vehicleColour: Joi.string(),
    vehicleVinNo:Joi.string(),
    vehicleRegisterationNo:Joi.string(),
    vehicleRegisterationDate:Joi.string(),
    actualPricePerHour:Joi.string(),
    meditourPricePerHour:Joi.string(),
  });
  
  const { error } = vehicleDetailSchema.validate(req.body);
  
  if (error) {
    return next(error);
  }
  const {
    vehicleType,
    vehicleName,
    vehicleModel,
    vehicleYear,
    vehicleColour,
    vehicleVinNo,
    vehicleRegisterationNo,
    vehicleRegisterationDate,
    actualPricePerHour,
    meditourPricePerHour,
  } = req.body;
  const vehicleCompanyId = req.user._id;
  
  const vehicleId = req.query.vehicleId;
  const existingVehicle = await vehicleDetail.findById(vehicleId);
  
  if (!existingVehicle) {
    const error = new Error("Vehicle not found!");
    error.status = 404;
    return next(error);
  }
  
  
  if (vehicleType) existingVehicle.vehicleType = vehicleType;
  if (vehicleName) existingVehicle.vehicleName = vehicleName;
  if (vehicleModel) existingVehicle.vehicleModel = vehicleModel;
  if (vehicleYear) existingVehicle.vehicleYear = vehicleYear;
  if (vehicleColour) existingVehicle.vehicleColour = vehicleColour;
  if (vehicleVinNo)
    existingVehicle.vehicleVinNo = vehicleVinNo;
  if (vehicleRegisterationNo) existingVehicle.vehicleRegisterationNo = vehicleRegisterationNo;
  if (vehicleRegisterationDate) existingVehicle.vehicleRegisterationDate = vehicleRegisterationDate;
  if (actualPricePerHour) existingVehicle.actualPricePerHour = actualPricePerHour;
  if (meditourPricePerHour) existingVehicle.actualPricePerHour = meditourPricePerHour;
  
  
  await existingVehicle.save();
  
  return res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle: existingVehicle,
  });
  },
  
  async deleteVehicle(req, res, next) {
  const vehicleId = req.query.vehicleId;
  const existingVehicle = await vehicleDetail.findById(vehicleId);
  
  if (!existingVehicle) {
    const error = new Error("vehicle not found!");
    error.status = 404;
    return next(error);
  }
  await vehicleDetail.deleteOne({ _id: vehicleId });
  console.log(existingVehicle)
  return res.status(200).json({ message: "Vehicle deleted successfully" });
  },
  
  async getVehicle(req, res, next) {
  try {
    const vehicleId = req.query.vehicleId;
    const vehicle = await vehicleDetail.findById(vehicleId);
  
    if (!vehicle) {
      const error = new Error("vehicle not found!");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ vehicle });
  } catch (error) {
    return next(error);
  }
  },
  
  async getAllVehicles(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1; 
    const vehiclePerPage = 10;
    const rentACarId = req.user._id;
    const totalVehicle = await vehicleDetail.countDocuments({
      rentACarId,
    }); 
    const totalPages = Math.ceil(totalVehicle / vehiclePerPage); 
  
    const skip = (page - 1) * vehiclePerPage; 
  
    const vehicles = await vehicleDetail.find({ rentACarId })
      .skip(skip)
      .limit(vehiclePerPage);
    let previousPage = page > 1 ? page - 1 : null;
    let nextPage = page < totalPages ? page + 1 : null;
    return res.status(200).json({
      vehicles: vehicles,
      auth: true,
      previousPage: previousPage,
      nextPage: nextPage,
    });
  } catch (error) {
    return next(error);
  }
  },


};

module.exports = vehicleDetailController;

