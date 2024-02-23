const express = require("express");
const app = express();
const Joi = require("joi");
const homeInfo = require("../../models/Hotel/homeInfo");
const homeDTO = require("../../dto/home");


const homeInfoController = {
  async addHome(req, res, next) {
    const homeInfoSchema  = Joi.object({
      guestBook: Joi.string().required(),
      similarPropertyCategory: Joi.string().required(),
      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      name: Joi.string().required(),
      contactNumber: Joi.string().required(),
      streetAddress: Joi.string().required(),
      addressLine2: Joi.string().required(),
      city: Joi.string().required(),
      postCode: Joi.string().required(),
      country: Joi.string().required(),
      partOfCompany: Joi.string().required(),
      channelManager: Joi.string(),
      nameOfCompany: Joi.string(),
      nameOfManager: Joi.string(),
      appartmentsNo: Joi.string(),
      customName: Joi.string(),
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string().required(),
      numberOfRooms: Joi.string().required(),
      beds: Joi.array.required(),
      noOfStayingGuests: Joi.string().required(),
      numberOfSofaBed: Joi.string().required(),
      guest: Joi.string().required(),
      appartmentSize: Joi.string().required(),
      basePricePerNight: Joi.string().required(),
      isParkingAvailable: Joi.string().required(),
      privateParking: Joi.string(),
      siteParking: Joi.string(),
      reservation: Joi.string(),
      priceOfParking: Joi.string(),
      language: Joi.string().required(),
      facilities: Joi.array(),
      amenities: Joi.string(),
      extraBed: Joi.string(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      accidentalBookingPolicy: Joi.boolean().required(),
      checkInFrom: Joi.string().required(),
      checkInTo: Joi.string().required(),
      checkOutFrom: Joi.string().required(),
      checkOutTo: Joi.string().required(),
      smoking: Joi.boolean(),
      accomodateChildren: Joi.boolean(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
      minimumStay: Joi.string().required(),
      selectedNumberOfBed: Joi.string().required(),
      extraBedAccomodateGuest: Joi.string(),
    });
    const { error } = homeInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      guestBook,
      similarPropertyCategory,
      propertyName,
      starRating,
      name,
      contactNumber,
      streetAddress,
      addressLine2,
      city,
      postCode,
      country,
      partOfCompany,
      channelManager,
      nameOfCompany,
      nameOfManager,
      appartmentsNo,
      customName,
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfRooms,
      beds,
      noOfStayingGuests,
      numberOfSofaBed,
      guest,
      appartmentSize,
      basePricePerNight,
      isParkingAvailable,
      privateParking,
      siteParking,
      reservation,
      priceOfParking,
      language,
      facilities,
      amenities,
      extraBed,
      propertyphoto,
      advanceCancelfreeofCharge,
      accidentalBookingPolicy,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      smoking,
      accomodateChildren,
      pets,
      chargesOfPets,
      minimumStay,
      selectedNumberOfBed,
      extraBedAccomodateGuest,
    } = req.body;
    let home;
    const hotelId = req.user._id;
    try {
      const homeInfoToRegister = new homeInfo({
        guestBook,
      similarPropertyCategory,
      propertyName,
      starRating,
      name,
      contactNumber,
      streetAddress,
      addressLine2,
      city,
      postCode,
      country,
      partOfCompany,
      channelManager,
      nameOfCompany,
      nameOfManager,
      appartmentsNo,
      customName,
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfRooms,
      beds,
      noOfStayingGuests,
      numberOfSofaBed,
      guest,
      appartmentSize,
      basePricePerNight,
      isParkingAvailable,
      privateParking,
      siteParking,
      reservation,
      priceOfParking,
      language,
      facilities,
      amenities,
      extraBed,
      propertyphoto,
      advanceCancelfreeofCharge,
      accidentalBookingPolicy,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      smoking,
      accomodateChildren,
      pets,
      chargesOfPets,
      minimumStay,
      selectedNumberOfBed,
      extraBedAccomodateGuest,
      });

      home = await homeInfoToRegister.save();
    } catch (error) {
      return next(error);
    }
    console.log(home);
    const homeDto = new homeDTO(home);
    console.log(homeDTO);

    return res.status(201).json({ Home: homeDto, auth: true });
  },
  // update
  async editHome(req, res, next) {
    const homeInfoSchema = Joi.object({
      guestBook: Joi.string(),
      similarPropertyCategory: Joi.string(),
      propertyName: Joi.string(),
      starRating: Joi.string(),
      name: Joi.string(),
      contactNumber: Joi.string(),
      streetAddress: Joi.string(),
      addressLine2: Joi.string(),
      city: Joi.string(),
      postCode: Joi.string(),
      country: Joi.string(),
      partOfCompany: Joi.string(),
      channelManager: Joi.string(),
      nameOfCompany: Joi.string(),
      nameOfManager: Joi.string(),
      appartmentsNo: Joi.string(),
      customName: Joi.string(),
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string(),
      numberOfRooms: Joi.string(),
      beds: Joi.array,
      noOfStayingGuests: Joi.string(),
      numberOfSofaBed: Joi.string(),
      guest: Joi.string(),
      appartmentSize: Joi.string(),
      basePricePerNight: Joi.string(),
      isParkingAvailable: Joi.string(),
      privateParking: Joi.string(),
      siteParking: Joi.string(),
      reservation: Joi.string(),
      priceOfParking: Joi.string(),
      language: Joi.string(),
      facilities: Joi.array(),
      amenities: Joi.string(),
      extraBed: Joi.string(),
      propertyphoto: Joi.string(),
      advanceCancelfreeofCharge: Joi.string(),
      accidentalBookingPolicy: Joi.boolean(),
      checkInFrom: Joi.string(),
      checkInTo: Joi.string(),
      checkOutFrom: Joi.string(),
      checkOutTo: Joi.string(),
      smoking: Joi.boolean(),
      accomodateChildren: Joi.boolean(),
      pets: Joi.string(),
      chargesOfPets: Joi.string(),
      minimumStay: Joi.string(),
      selectedNumberOfBed: Joi.string(),
      extraBedAccomodateGuest: Joi.string(),
    });
    const { error } = homeInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      guestBook,
      similarPropertyCategory,
      propertyName,
      starRating,
      name,
      contactNumber,
      streetAddress,
      addressLine2,
      city,
      postCode,
      country,
      partOfCompany,
      channelManager,
      nameOfCompany,
      nameOfManager,
      appartmentsNo,
      customName,
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfRooms,
      beds,
      noOfStayingGuests,
      numberOfSofaBed,
      guest,
      appartmentSize,
      basePricePerNight,
      isParkingAvailable,
      privateParking,
      siteParking,
      reservation,
      priceOfParking,
      language,
      facilities,
      amenities,
      extraBed,
      propertyphoto,
      advanceCancelfreeofCharge,
      accidentalBookingPolicy,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      smoking,
      accomodateChildren,
      pets,
      chargesOfPets,
      minimumStay,
      selectedNumberOfBed,
      extraBedAccomodateGuest,
    } = req.body;

    const hotelHomeId = req.user._id;

    const homeId = req.query.homeId;
    const existingHome = await homeInfo.findById(homeId);

    if (!existingHome) {
      const error = new Error("Home not found!");
      error.status = 404;
      return next(error);
    }
    // fields to 
    if (guestBook) existingHome.guestBook = guestBook;
    if (similarPropertyCategory) existingHome.similarPropertyCategory = similarPropertyCategory;
    if (propertyName) existingHome.propertyName = propertyName;
    if (starRating) existingHome.starRating = starRating;
    if (name) existingHome.name = name;
    if (contactNumber) existingHome.contactNumber = contactNumber;
    if (streetAddress) existingHome.streetAddress = streetAddress;
    if (addressLine2) existingHome.addressLine2 = addressLine2;
    if (city) existingHome.city = city;
    if (postCode) existingHome.postCode = postCode;
    if (country) existingHome.country = country;
    if (partOfCompany) existingHome.partOfCompany = partOfCompany;
    if (nameOfCompany) existingHome.nameOfCompany = nameOfCompany;
    if (channelManager) existingHome.channelManager = channelManager;
    if (nameOfManager) existingHome.nameOfManager = nameOfManager;
    if (appartmentsNo) existingHome.appartmentsNo = appartmentsNo;
    if (customName) existingHome.customName = customName;
    if (numberOfBedroom) existingHome.numberOfBedroom = numberOfBedroom;
    if (numberOfLivingroom)
      existingHome.numberOfLivingroom = numberOfLivingroom;
    if (numberOfBathroom)
      existingHome.numberOfBathroom = numberOfBathroom;
    if (numberOfRooms)
      existingHome.numberOfRooms = numberOfRooms;
    if (beds)
      existingHome.beds = beds;
    if (noOfStayingGuests)
      existingHome.noOfStayingGuests = noOfStayingGuests;
    if (privateBathroom) existingHome.privateBathroom = privateBathroom;
    if (numberOfSofaBed) existingHome.numberOfSofaBed = numberOfSofaBed;
    if (guest) existingHome.guest = guest;
    if (appartmentSize) existingHome.appartmentSize = appartmentSize;
    if (basePricePerNight) existingHome.basePricePerNight = basePricePerNight;
    if (isParkingAvailable)
      existingHome.isParkingAvailable = isParkingAvailable;
    if (privateParking) existingHome.privateParking = privateParking;
    if (siteParking) existingHome.siteParking = siteParking;
    if (reservation) existingHome.reservation = reservation;
    if (priceOfParking) existingHome.priceOfParking = priceOfParking;
    if (language) existingHome.language = language;
    if (facilities) existingHome.facilities = facilities;
    if (amenities)
      existingHome.amenities = amenities;
    if (extraBed) existingHome.extraBed = extraBed;
    if (propertyphoto) existingHome.propertyphoto = propertyphoto;
    if (advanceCancelfreeofCharge) existingHome.advanceCancelfreeofCharge = advanceCancelfreeofCharge;
    if (accidentalBookingPolicy) existingHome.accidentalBookingPolicy = accidentalBookingPolicy;
    if (checkInFrom)
      existingHome.checkInFrom = checkInFrom;
    if (checkInTo)
      existingHome.checkInTo = checkInTo;
    if (checkOutFrom)
      existingHome.checkOutFrom = checkOutFrom;
    if (checkOutTo)
      existingHome.checkOutTo = checkOutTo;
    if (smoking) existingHome.smoking = smoking;
    if (accomodateChildren)
      existingHome.accomodateChildren = accomodateChildren;
    if (pets) existingHome.pets = pets;
    if (chargesOfPets) existingHome.chargesOfPets = chargesOfPets;
    if (minimumStay) existingHome.minimumStay = minimumStay;
    if (selectedNumberOfBed) existingHome.selectedNumberOfBed = selectedNumberOfBed;
    if (extraBedAccomodateGuest) existingHome.extraBedAccomodateGuest = extraBedAccomodateGuest;

    await existingHome.save();

    return res.status(200).json({
      message: " Home updated successfully",
      home: existingHome,
    });
  },

  async deleteHome(req, res, next) {
    const homeId = req.query.homeId;
    const existingHome = await homeInfo.findById(homeId);

    if (!existingHome) {
      const error = new Error("Home not found!");
      error.status = 404;
      return next(error);
    }
    await homeInfo.deleteOne({ _id: homeId });
    return res.status(200).json({ message: "Home deleted successfully" });
  },

  async getHome(req, res, next) {
    try {
      const homeId = req.query.homeId;
      const home = await homeInfo .findById(homeId);

      if (!home) {
        const error = new Error("Home not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ home});
    } catch (error) {
      return next(error);
    }
  },

  async getAllHomes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const homePerPage = 10;
      const hotelId = req.user._id;
      const totalHome = await homeInfo.countDocuments({
        hotelId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalHome / homePerPage); // Calculate the total number of pages

      const skip = (page - 1) * homePerPage; // Calculate the number of posts to skip based on the current page

      const homes = await homeInfo
        .find({ hotelId })
        .skip(skip)
        .limit(homePerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        homes: homes,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = homeInfoController;
