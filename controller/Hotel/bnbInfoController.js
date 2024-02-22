const express = require("express");
const app = express();
const Joi = require("joi");
const bnbInfo = require("../../models/Hotel/bnbInfo");
const bnbDTO = require("../../dto/bnb");

const BnbInfoController = {
  async addBnb(req, res, next) {
    const bnbInfoSchema = Joi.object({
      category: Joi.string().required(),
      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      customName: Joi.string().required(),
      contactNumber: Joi.string().required(),
      alternativeContactNo: Joi.string().required(),
      province: Joi.string().required(),
      propertyAddress: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      rooms: Joi.array(),
      parkingAvailability: Joi.boolean().required(),
      parkingPrice: Joi.string().required(),
      language: Joi.string().required(),
      facilities: Joi.array(),
      extraBedAvailability: Joi.boolean(),
      noOfExtraBeds: Joi.string(),
      guestsInExtraBeds: Joi.array(),
      amenities: Joi.array(),
      propertyphotos: Joi.array().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      guestPayFull: Joi.string().required(),
      accidentalBookingPolicy: Joi.boolean().required(),
      checkInFrom: Joi.string().required(),
      checkInTo: Joi.string().required(),
      checkOutFrom: Joi.string().required(),
      checkOutTo: Joi.string().required(),
      accomodateChildren: Joi.boolean(),
      pets: Joi.boolean(),
      chargesOfPets: Joi.string().required(),
    });
    const { error } = bnbInfoSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      category,
      propertyName,
      starRating,
      customName,
      contactNumber,
      alternativeContactNo,
      province,
      propertyAddress,
      zipCode,
      country,
      rooms,
      parkingAvailability,
      parkingPrice,
      language,
      facilities,
      extraBedAvailability,
      noOfExtraBeds,
      guestsInExtraBeds,
      amenities,
      propertyphotos,
      advanceCancelfreeofCharge,
      guestPayFull,
      accidentalBookingPolicy,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      accomodateChildren,
      pets,
      chargesOfPets,
    } = req.body;
    let bnb;
    const hotelId = req.user._id;
    try {
      const bnbInfoToRegister = new bnbInfo({
        hotelId,
        category,
        propertyName,
        starRating,
        customName,
        contactNumber,
        alternativeContactNo,
        province,
        propertyAddress,
        zipCode,
        country,
        rooms,
        parkingAvailability,
        parkingPrice,
        language,
        facilities,
        extraBedAvailability,
        noOfExtraBeds,
        guestsInExtraBeds,
        amenities,
        propertyphotos,
        advanceCancelfreeofCharge,
        guestPayFull,
        accidentalBookingPolicy,
        checkInFrom,
        checkInTo,
        checkOutFrom,
        checkOutTo,
        accomodateChildren,
        pets,
        chargesOfPets,
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

  async updateBnb(req, res, next) {
    const bnbInfoSchema = Joi.object({
      category: Joi.string(),
      propertyName: Joi.string(),
      starRating: Joi.string(),
      customName: Joi.string(),
      contactNumber: Joi.string(),
      alternativeContactNo: Joi.string(),
      province: Joi.string(),
      propertyAddress: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string(),
      rooms: Joi.array(),
      parkingAvailability: Joi.boolean(),
      parkingPrice: Joi.string(),
      language: Joi.string(),
      facilities: Joi.array(),
      extraBedAvailability: Joi.string(),
      noOfExtraBeds: Joi.string(),
      guestsInExtraBeds: Joi.string(),
      amenities: Joi.string(),
      propertyphotos: Joi.string(),
      advanceCancelfreeofCharge: Joi.string(),
      guestPayFull: Joi.string().required(),
      accidentalBookingPolicy: Joi.boolean().required(),
      checkInFrom: Joi.string(),
      checkInTo: Joi.string(),
      checkOutFrom: Joi.string(),
      checkOutTo: Joi.string(),
      accomodateChildren: Joi.string(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
    });
    const { error } = bnbInfoSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      category,
      propertyName,
      starRating,
      customName,
      contactNumber,
      alternativeContactNo,
      province,
      propertyAddress,
      zipCode,
      country,
      rooms,
      parkingAvailability,
      parkingPrice,
      language,
      facilities,
      extraBedAvailability,
      noOfExtraBeds,
      guestsInExtraBeds,
      amenities,
      propertyphotos,
      advanceCancelfreeofCharge,
      guestPayFull,
      accidentalBookingPolicy,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      accomodateChildren,
      pets,
      chargesOfPets,
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

    if (category) prevBnb.category = category;
    if (propertyName) prevBnb.propertyName = propertyName;
    if (starRating) prevBnb.starRating = starRating;
    if (customName) prevBnb.customName = customName;
    if (contactNumber) prevBnb.contactNumber = contactNumber;
    if (alternativeContactNo)
      prevBnb.alternativeContactNo = alternativeContactNo;
    if (province) prevBnb.province = province;
    if (propertyAddress) prevBnb.propertyAddress = propertyAddress;
    if (zipCode) prevBnb.zipCode = zipCode;
    if (country) prevBnb.country = country;
    if (rooms) prevBnb.rooms = rooms;
    if (parkingAvailability) prevBnb.parkingAvailability = parkingAvailability;
    if (parkingPrice) prevBnb.parkingPrice = parkingPrice;
    if (language) prevBnb.language = language;
    if (facilities) prevBnb.facilities = facilities;
    if (extraBedAvailability)
      prevBnb.extraBedAvailability = extraBedAvailability;
    if (noOfExtraBeds) prevBnb.noOfExtraBeds = noOfExtraBeds;
    if (guestsInExtraBeds) prevBnb.guestsInExtraBeds = guestsInExtraBeds;
    if (amenities) prevBnb.amenities = amenities;
    if (propertyphotos) prevBnb.propertyphotos = propertyphotos;
    if (advanceCancelfreeofCharge)
      prevBnb.advanceCancelfreeofCharge = advanceCancelfreeofCharge;
    if (guestPayFull)
      prevBnb.guestPayFull = guestPayFull;
    if (accidentalBookingPolicy)
      prevBnb.accidentalBookingPolicy = accidentalBookingPolicy;
    if (checkInFrom) prevBnb.checkInFrom = checkInFrom;
    if (checkInTo) prevBnb.checkInTo = checkInTo;
    if (checkOutFrom) prevBnb.checkOutFrom = checkOutFrom;
    if (checkOutTo) prevBnb.checkOutTo = checkOutTo;
    if (accomodateChildren) prevBnb.accomodateChildren = accomodateChildren;
    if (pets) prevBnb.pets = pets;
    if (chargesOfPets) prevBnb.chargesOfPets = chargesOfPets;
    await prevBnb.save();

    return res.status(200).json({
      message: "B&Bs Updated Successfully",
      bnb: prevBnb,
    });
  },
  async deleteBnb(req, res, next) {
    const bnbId = req.query.bnbId;
    const prevBnb = await bnbInfo.findById(bnbId);

    if (!prevBnb) {
      const error = new Error("B&B not found");
      error.status = 404;
      return next(error);
    }
    await bnbInfo.deleteOne({ _id: bnbId });
    return res.status(200).json({ message: "B&B deleted successfully" });
  },

  async getBnb(req, res, next) {
    try {
      const bnbId = req.query.bnbId;
      const bnb = await bnbInfo.findById(bnbId);

      if (!bnb) {
        const error = new Error("B&B not found!");
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

      const bnb = await bnbInfo.find({ hotelId }).skip(skip).limit(bnbsPerPage);
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
  },
};

module.exports = BnbInfoController;
