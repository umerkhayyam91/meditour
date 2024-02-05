const express = require("express");
const app = express();
const Joi = require("joi");
const bnbInfo = require("../../models/Hotel/bnbInfo");
const bnbDTO = require("../../dto/bnb");

const BnbInfoController = {
  async addBnb(req, res, next) {
    const bnbInfoSchema = Joi.object({
      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      customName: Joi.string().required(),
      contactNumber: Joi.string().required(),
      alternativeContactNo: Joi.string().required(),
      province: Joi.string().required(),
      propertyAddress: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      roomType: Joi.string().required(),
      roomName: Joi.string().required(),
      smokingPolicy: Joi.string().required(),
      noOfAllRooms: Joi.string().required(),
      bedKinds: Joi.string().required(),
      bedNo: Joi.string().required(),
      guestNo: Joi.string().required(),
      roomSize: Joi.string().required(),
      pricePerNight: Joi.string().required(),
      priceForMeditour: Joi.string().required(),
      parkingAvailability: Joi.string().required(),
      parkingPrice: Joi.string().required(),
      language: Joi.string().required(),
      facillities: Joi.string(),
      extraBed: Joi.string(),
      addExtraBed: Joi.string(),
      guestsInExtraBeds: Joi.string(),
      amenities: Joi.string(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      checkInForm: Joi.string().required(),
      checkOutForm: Joi.string().required(),
      accomodateChildren: Joi.string(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
      addAnotherProperty: Joi.string(),
    });
    const { error } = bnbInfoSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      propertyName,
      starRating,
      customName,
      contactNumber,
      alternativeContactNo,
      province,
      propertyAddress,
      zipCode,
      country,
      roomType,
      roomName,
      smokingPolicy,
      noOfAllRooms,
      bedKinds,
      bedNo,
      guestNo,
      roomSize,
      pricePerNight,
      priceForMeditour,
      parkingAvailability,
      parkingPrice,
      language,
      facillities,
      extraBed,
      addExtraBed,
      guestsInExtraBeds,
      amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      checkInForm,
      checkOutForm,
      accomodateChildren,
      pets,
      chargesOfPets,
      addAnotherProperty,
    } = req.body;
    let bnb;
    const hotelId = req.user._id;
    try {
      const bnbInfoToRegister = new bnbInfo({
        hotelId,
        propertyName,
        starRating,
        customName,
        contactNumber,  
        alternativeContactNo,
        province,
        propertyAddress,
        zipCode,
        country,
        roomType,
        roomName,
        smokingPolicy,
        noOfAllRooms,
        bedKinds,
        bedNo,
        guestNo,
        roomSize,
        pricePerNight,
        priceForMeditour,
        parkingAvailability,
        parkingPrice,
        language,
        facillities,
        extraBed,
        addExtraBed,
        guestsInExtraBeds,
        amenities,
        propertyphoto,
        advanceCancelfreeofCharge,
        checkInForm,
        checkOutForm,
        accomodateChildren,
        pets,
        chargesOfPets,
        addAnotherProperty,
      });

      bnb = await bnbInfoToRegister.save();
    } catch (error) {
      return next(error);
    }
    console.log(bnb);
    const bnbDto = new bnbDTO(bnb);
    console.log(bnbDTO);

    return res.status(201).json({ Bnb: bnbDto, auth: true });
  },

  //edit

  async updateBnb(req, res, next) {
    const bnbInfoSchema = Joi.object({
      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      customName: Joi.string().required(),
      contactNumber: Joi.string().required(),
      alternativeContactNo: Joi.string().required(),
      province: Joi.string().required(),
      propertyAddress: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      roomType: Joi.string().required(),
      roomName: Joi.string().required(),
      smokingPolicy: Joi.string().required(),
      noOfAllRooms: Joi.string().required(),
      bedKinds: Joi.string().required(),
      bedNo: Joi.string().required(),
      guestNo: Joi.string().required(),
      roomSize: Joi.string().required(),
      pricePerNight: Joi.string().required(),
      priceForMeditour: Joi.string().required(),
      parkingAvailability: Joi.string().required(),
      parkingPrice: Joi.string().required(),
      language: Joi.string().required(),
      facillities: Joi.string(),
      extraBed: Joi.string(),
      addExtraBed: Joi.string(),
      guestsInExtraBeds: Joi.string(),
      amenities: Joi.string(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      checkInForm: Joi.string().required(),
      checkOutForm: Joi.string().required(),
      accomodateChildren: Joi.string(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
      addAnotherProperty: Joi.string(),
    });
    const { error } = bnbInfoSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      propertyName,
      starRating,
      customName,
      contactNumber, 
      alternativeContactNo,
      province,
      propertyAddress,
      zipCode,
      country,
      roomType,
      roomName,
      smokingPolicy,
      noOfAllRooms,
      bedKinds,
      bedNo,
      guestNo,
      roomSize,
      pricePerNight,
      priceForMeditour,
      parkingAvailability,
      parkingPrice,
      language,
      facillities,
      extraBed,
      addExtraBed,
      guestsInExtraBeds,
      amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      checkInForm,
      checkOutForm,
      accomodateChildren,
      pets,
      chargesOfPets,
      addAnotherProperty,
    } = req.body;
    const hotelBnbId = req.user._id;

    const bnbId = req.query.bnbId;
    const prevBnb = await bnbInfo.findById(bnbId);

    if (!prevBnb) {
      const error = new Error("B&bs not found");
      error.status = 404;
      return next(error);
    }

    // update fields

    if (propertyName) prevBnb.propertyName = propertyName;
    if (starRating) prevBnb.starRating = starRating;
    if (customName) prevBnb.customName = customName;
    if (contactNumber) prevBnb.contactNumber = contactNumber;
    if (alternativeContactNo) prevBnb.alternativeContactNo = alternativeContactNo;   
    if (province) prevBnb.province = province;
    if (propertyAddress) prevBnb.propertyAddress = propertyAddress;
    if (zipCode) prevBnb.zipCode = zipCode;
    if (country) prevBnb.country = country;
    if (roomType) prevBnb.roomType = roomType;   
    if (roomName) prevBnb.roomName = roomName;
    if (smokingPolicy) prevBnb.smokingPolicy = smokingPolicy;
    if (noOfAllRooms) prevBnb.noOfAllRooms = noOfAllRooms;
    if (bedKinds) prevBnb.bedKinds = bedKinds;
    if (alternativeContactNo) prevBnb.alternativeContactNo = alternativeContactNo;   
    if (bedNo) prevBnb.bedNo = bedNo;
    if (guestNo) prevBnb.guestNo = guestNo;
    if (roomSize) roomSize.zipCode = roomSize;
    if (pricePerNight) prevBnb.pricePerNight = pricePerNight;
    if (priceForMeditour) prevBnb.priceForMeditour = priceForMeditour;   
    if (parkingAvailability) prevBnb.parkingAvailability = parkingAvailability;
    if (parkingPrice) prevBnb.parkingPrice = parkingPrice;
    if (language) prevBnb.language = language;
    if (facillities) prevBnb.facillities = facillities;
    if (extraBed) prevBnb.extraBed = extraBed;   
    if (addExtraBed) prevBnb.addExtraBed = addExtraBed;
    if (guestsInExtraBeds) prevBnb.guestsInExtraBeds = guestsInExtraBeds;
    if (amenities)prevBnb.amenities = amenities;
    if (propertyphoto) prevBnb.propertyphoto = propertyphoto;
    if (advanceCancelfreeofCharge) prevBnb.advanceCancelfreeofCharge = advanceCancelfreeofCharge;   
    if (checkInForm) prevBnb.checkInForm = checkInForm;
    if (checkOutForm) prevBnb.checkOutForm = checkOutForm;
    if (accomodateChildren) prevBnb.accomodateChildren = accomodateChildren;
    if (pets) prevBnb.pets = pets;
    if (chargesOfPets) prevBnb.chargesOfPets = chargesOfPets;   
    if (addAnotherProperty) prevBnb.addAnotherProperty = addAnotherProperty;
    await prevBnb.save();

    return res
      .status(200)
      .json({
        message: "B&Bs Updated Successfully",
        bnb: prevBnb,
      });
  },
  async deleteBnb(req, res, next) {
    const bnbId = req.query.bnbId;
    const prevBnb = await bnbInfo.findById(bnbId);

    if (!prevBnb) {
        const error = new Error("B&Bs not found");
        error.status = 404;
        return next(error);
      }
    await bnbInfo.deleteOne({  _id:bnbId });
    return res.status(200).json({ message: "B&B deleted successfully" });
  },

  async getBnb(req, res, next) {
    try {
      const bnbId = req.query.bnbId;
      const bnb = await bnbInfo.findById(bnbId);

      if (!bnb) {
        const error = new Error("B&Bs not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ bnb });
    } catch (error) {
      return next(error);
    }
  },

  async getAllBnb(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const bnbsPerPage = 10;
      const hotelId = req.user._id;
      const totalBnb = await bnbInfo.countDocuments({
        hotelId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalBnb / bnbsPerPage); // Calculate the total number of pages

      const skip = (page - 1) * bnbsPerPage; // Calculate the number of posts to skip based on the current page

      const bnb = await bnbInfo.find({ hotelId })
        .skip(skip)
        .limit(bnbsPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        bnb: bnb,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = BnbInfoController;
