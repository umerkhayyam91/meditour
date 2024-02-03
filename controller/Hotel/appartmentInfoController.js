const express = require("express");
const app = express();
const appartmentDTO = require("../../dto/appartment");
const appartmentInfo = require("../../models/Hotel/appartmentInfo.js");
const Joi = require("joi");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");
const bcrypt = require("bcryptjs");

const appartmentInfoController = {
  async addAppartment(req, res, next) {
    const appartmentInfoSchema = Joi.object({

      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      customName: Joi.string().required(),
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
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string().required(),
      numberOfAppartments: Joi.string().required(),
      typeOfAppartments: Joi.string().required(),
      kindOfBeds: Joi.string().required(),
      numberOfBed: Joi.string().required(),
      addAnotherBed: Joi.string().required(),
      noOfStayingGuests: Joi.string().required(),
      ownerImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string(),
      privateBathroom: Joi.boolean().required(),
      numberOfSofaBed: Joi.string().required(),
      guest: Joi.string().required(),
      appartmentSize: Joi.string().required(),
      basePricePerNight: Joi.string().required(),
      isParkingAvailable: Joi.string().required(),
      parkingtype: Joi.string(),
      siteParking: Joi.string(),
      reservation: Joi.string(),
      priceOfParking: Joi.string(),
      breakfast: Joi.string().required(),
      priceOfBreakfast: Joi.string(),
      kindOfBreakfast: Joi.string(),
      language: Joi.string().required(),
      facillities: Joi.string(),
      extraBed: Joi.string(),
      selectedNumberOfBed: Joi.string().required(),
      extraBedAccomodateGuest: Joi.string(),
      amenities: Joi.string(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      checkInForm: Joi.string().required(),
      checkOutForm: Joi.string().required(),
      smoking: Joi.string(),
      accomodateChildren: Joi.string(),
      minimumStay: Joi.string().required(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
      addAnotherProperty: Joi.string(),
    });
    const { error } = appartmentInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      propertyName,
      starRating,
      customName,
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
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfAppartments,
      typeOfAppartments,
      kindOfBeds,
      numberOfBed,
      addAnotherBed,
      ownerImage,
      cnicImage,
      taxFileImage,
      noOfStayingGuests,
      privateBathroom,
      numberOfSofaBed,
      guest,
      appartmentSize,
      basePricePerNight,
      isParkingAvailable,
      parkingtype,
      siteParking,
      reservation,
      priceOfParking,
      breakfast,
      priceOfBreakfast,
      kindOfBreakfast,
      language,
      facillities,
      extraBed,
      selectedNumberOfBed,
      extraBedAccomodateGuest,
      amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      checkInForm,
      checkOutForm,
      smoking,
      accomodateChildren,
      minimumStay,
      pets,
      chargesOfPets,
      addAnotherProperty,
    } = req.body;
    let appartment;
    const hotelId = req.user._id;
    try {
      const appartmentInfoToRegister = new appartmentInfo({
        hotelId,
        propertyName,
        starRating,
        customName,
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
        numberOfBedroom,
        numberOfLivingroom,
        numberOfBathroom,
        numberOfAppartments,
        typeOfAppartments,
        kindOfBeds,
        numberOfBed,
        addAnotherBed,
        ownerImage,
        cnicImage,
        taxFileImage,
        noOfStayingGuests,
        privateBathroom,
        numberOfSofaBed,
        guest,
        appartmentSize,
        basePricePerNight,
        isParkingAvailable,
        parkingtype,
        siteParking,
        reservation,
        priceOfParking,
        breakfast,
        priceOfBreakfast,
        kindOfBreakfast,
        language,
        facillities,
        extraBed,
        selectedNumberOfBed,
        extraBedAccomodateGuest,
        amenities,
        propertyphoto,
        advanceCancelfreeofCharge,
        checkInForm,
        checkOutForm,
        smoking,
        accomodateChildren,
        minimumStay,
        pets,
        chargesOfPets,
        addAnotherProperty,
      });

      appartment = await appartmentInfoToRegister.save();
    } catch (error) {
      return next(error);
    }
    console.log(appartment);
    const appartmentDto = new appartmentDTO(appartment);
    console.log(appartmentDTO);

    return res.status(201).json({ Appartment: appartmentDto, auth: true });
  },
  // update
  async editAppartment(req, res, next) {
    const appartmentInfoSchema = Joi.object({
      propertyName: Joi.string().required(),
      starRating: Joi.string().required(),
      customName: Joi.string().required(),
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
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string().required(),
      numberOfAppartments: Joi.string().required(),
      typeOfAppartments: Joi.string().required(),
      kindOfBeds: Joi.string().required(),
      numberOfBed: Joi.string().required(),
      addAnotherBed: Joi.string().required(),
      noOfStayingGuests: Joi.string().required(),
      ownerImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string(),
      privateBathroom: Joi.boolean().required(),
      numberOfSofaBed: Joi.string().required(),
      guest: Joi.string().required(),
      appartmentSize: Joi.string().required(),
      basePricePerNight: Joi.string().required(),
      isParkingAvailable: Joi.string().required(),
      parkingtype: Joi.string(),
      siteParking: Joi.string(),
      reservation: Joi.string(),
      priceOfParking: Joi.string(),
      breakfast: Joi.string().required(),
      priceOfBreakfast: Joi.string(),
      kindOfBreakfast: Joi.string(),
      language: Joi.string().required(),
      facillities: Joi.string(),
      extraBed: Joi.string(),
      selectedNumberOfBed: Joi.string().required(),
      extraBedAccomodateGuest: Joi.string(),
      amenities: Joi.string(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      checkInForm: Joi.string().required(),
      checkOutForm: Joi.string().required(),
      smoking: Joi.string(),
      accomodateChildren: Joi.string(),
      minimumStay: Joi.string().required(),
      pets: Joi.string(),
      chargesOfPets: Joi.string().required(),
      addAnotherProperty: Joi.string(),
    });
    const { error } = appartmentInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      propertyName,
      starRating,
      customName,
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
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfAppartments,
      typeOfAppartments,
      kindOfBeds,
      numberOfBed,
      addAnotherBed,
      ownerImage,
      cnicImage,
      taxFileImage,
      noOfStayingGuests,
      privateBathroom,
      numberOfSofaBed,
      guest,
      appartmentSize,
      basePricePerNight,
      isParkingAvailable,
      parkingtype,
      siteParking,
      reservation,
      priceOfParking,
      breakfast,
      priceOfBreakfast,
      kindOfBreakfast,
      language,
      facillities,
      extraBed,
      selectedNumberOfBed,
      extraBedAccomodateGuest,
      amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      checkInForm,
      checkOutForm,
      smoking,
      accomodateChildren,
      minimumStay,
      pets,
      chargesOfPets,
      addAnotherProperty,
    } = req.body;

    const hotelAppartmentId = req.user._id;

    const appartmentId = req.query.appartmentId;
    const existingAppartment = await appartmentInfo.findById(appartmentId);

    if (!existingAppartment) {
      const error = new Error("Appartment not found!");
      error.status = 404;
      return next(error);
    }
    // fields

    if (propertyName) existingAppartment.propertyName = propertyName;
    if (starRating) existingAppartment.starRating = starRating;
    if (customName) existingAppartment.customName = customName;
    if (contactNumber) existingAppartment.contactNumber = contactNumber;
    if (streetAddress) existingAppartment.streetAddress = streetAddress;
    if (addressLine2) existingAppartment.addressLine2 = addressLine2;
    if (city) existingAppartment.city = city;
    if (postCode) existingAppartment.postCode = postCode;
    if (country) existingAppartment.country = country;
    if (partOfCompany) existingAppartment.partOfCompany = partOfCompany;
    if (channelManager) existingAppartment.channelManager = channelManager;
    if (nameOfCompany) existingAppartment.nameOfCompany = nameOfCompany;
    if (nameOfManager) existingAppartment.nameOfManager = nameOfManager;
    if (numberOfBedroom) existingAppartment.numberOfBedroom = numberOfBedroom;
    if (numberOfLivingroom)
      existingAppartment.numberOfLivingroom = numberOfLivingroom;
    if (numberOfBathroom)
      existingAppartment.numberOfBathroom = numberOfBathroom;
    if (numberOfAppartments)
      existingAppartment.numberOfAppartments = numberOfAppartments;
    if (typeOfAppartments)
      existingAppartment.typeOfAppartments = typeOfAppartments;
    if (kindOfBeds) existingAppartment.kindOfBeds = kindOfBeds;
    if (numberOfBed) existingAppartment.numberOfBed = numberOfBed;
    if (addAnotherBed) existingAppartment.addAnotherBed = addAnotherBed;
    if (ownerImage) existingAppartment.ownerImage = ownerImage;
    if (cnicImage) existingAppartment.cnicImage = cnicImage;
    if (taxFileImage) existingAppartment.taxFileImage = taxFileImage;
    if (noOfStayingGuests)
      existingAppartment.noOfStayingGuests = noOfStayingGuests;
    if (privateBathroom) existingAppartment.privateBathroom = privateBathroom;
    if (numberOfSofaBed) existingAppartment.numberOfSofaBed = numberOfSofaBed;
    if (guest) existingAppartment.guest = guest;
    if (appartmentSize) existingAppartment.appartmentSize = appartmentSize;
    if (basePricePerNight) existingAppartment.basePricePerNight = basePricePerNight;
    if (isParkingAvailable)
      existingAppartment.isParkingAvailable = isParkingAvailable;
    if (parkingtype) existingAppartment.parkingtype = parkingtype;
    if (siteParking) existingAppartment.siteParking = siteParking;
    if (reservation) existingAppartment.reservation = reservation;
    if (priceOfParking) existingAppartment.priceOfParking = priceOfParking;
    if (breakfast) existingAppartment.breakfast = breakfast;
    if (priceOfBreakfast)
      existingAppartment.priceOfBreakfast = priceOfBreakfast;
    if (kindOfBreakfast) existingAppartment.kindOfBreakfast = kindOfBreakfast;
    if (language) existingAppartment.language = language;
    if (facillities) existingAppartment.facillities = facillities;
    if (extraBed) existingAppartment.extraBed = extraBed;
    if (selectedNumberOfBed)
      existingAppartment.selectedNumberOfBed = selectedNumberOfBed;
    if (extraBedAccomodateGuest)
      existingAppartment.extraBedAccomodateGuest = extraBedAccomodateGuest;
    if (amenities) existingAppartment.amenities = amenities;
    if (propertyphoto) existingAppartment.propertyphoto = propertyphoto;
    if (advanceCancelfreeofCharge)
      existingAppartment.advanceCancelfreeofCharge = advanceCancelfreeofCharge;
    if (checkInForm) existingAppartment.checkInForm = checkInForm;
    if (checkOutForm) existingAppartment.checkOutForm = checkOutForm;
    if (smoking) existingAppartment.smoking = smoking;
    if (accomodateChildren)
      existingAppartment.accomodateChildren = accomodateChildren;
    if (minimumStay) existingAppartment.minimumStay = minimumStay;
    if (pets) existingAppartment.pets = pets;
    if (chargesOfPets) existingAppartment.chargesOfPets = chargesOfPets;
    if (addAnotherProperty) existingAppartment.addAnotherProperty = addAnotherProperty;
    
    await existingAppartment.save();

    return res.status(200).json({
      message: " Appartment updated successfully",
      appartment: existingAppartment,
    });
  },

  async deleteAppartment(req, res, next) {
    const appartmentId = req.query.appartmentId;
    const existingAppartment = await appartmentInfo.findById(appartmentId);

    if (!existingAppartment) {
      const error = new Error("Appartment not found!");
      error.status = 404;
      return next(error);
    }
    await appartmentInfo.deleteOne({ _id: appartmentId });
    return res.status(200).json({ message: "Appartment deleted successfully" });
  },

  async getAppartment(req, res, next) {
    try {
      const appartmentId = req.query.appartmentId;
      const appartment = await appartmentInfo.findById(appartmentId);

      if (!appartment) {
        const error = new Error("Appartment not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ appartment });
    } catch (error) {
      return next(error);
    }
  },

  async getAllAppartments(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const appartmentsPerPage = 10;
      const hotelId = req.user._id;
      const totalAppartment = await appartmentInfo.countDocuments({
        hotelId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalAppartment / appartmentsPerPage); // Calculate the total number of pages

      const skip = (page - 1) * appartmentsPerPage; // Calculate the number of posts to skip based on the current page

      const appartments = await appartmentInfo
        .find({ hotelId })
        .skip(skip)
        .limit(appartmentsPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        appartments: appartments,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = appartmentInfoController;
