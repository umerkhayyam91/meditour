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
      propertyOwnership: Joi.string().required(),
      channelManager: Joi.string(),
      nameOfCompany: Joi.string(),
      nameOfManager: Joi.string(),
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string().required(),
      numberOfAppartments: Joi.string().required(),
      TypeOfAppartments: Joi.string().required(),
      KindOfBeds: Joi.string().required(),
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
      parkingtype: Joi.string().required(),
      siteParking: Joi.string().required(),
      reservation: Joi.string().required(),
      priceOfParking: Joi.string().required(),
      breakfast: Joi.string().required(),
      priceOfBreakfast: Joi.string().required(),
      kindOfBreakfast: Joi.string().required(),
      language: Joi.string().required(),
      facillities: Joi.string().required(),
      extraBed: Joi.string().required(),
      selectedNumberOfBed: Joi.string().required(),
      extraBedAccomodateGuest: Joi.string().required(),
      Amenities: Joi.string().required(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      CheckInForm: Joi.string().required(),
      CheckOutForm: Joi.string().required(),
      smoking: Joi.string().required(),
      AccomodateChildren: Joi.string().required(),
      minimumStay: Joi.string().required(),
      pets: Joi.string().required(),
      chargesOfPets: Joi.string().required(),
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
      propertyOwnership,
      channelManager,
      nameOfCompany,
      nameOfManager,
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfAppartments,
      TypeOfAppartments,
      KindOfBeds,
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
      Amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      CheckInForm,
      CheckOutForm,
      smoking,
      AccomodateChildren,
      minimumStay,
      pets,
      chargesOfPets,
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
        propertyOwnership,
        channelManager,
        nameOfCompany,
        nameOfManager,
        numberOfBedroom,
        numberOfLivingroom,
        numberOfBathroom,
        numberOfAppartments,
        TypeOfAppartments,
        KindOfBeds,
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
        Amenities,
        propertyphoto,
        advanceCancelfreeofCharge,
        CheckInForm,
        CheckOutForm,
        smoking,
        AccomodateChildren,
        minimumStay,
        pets,
        chargesOfPets,
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
      propertyOwnership: Joi.string().required(),
      channelManager: Joi.string(),
      nameOfCompany: Joi.string(),
      nameOfManager: Joi.string(),
      numberOfBedroom: Joi.string(),
      numberOfLivingroom: Joi.string(),
      numberOfBathroom: Joi.string().required(),
      numberOfAppartments: Joi.string().required(),
      TypeOfAppartments: Joi.string().required(),
      KindOfBeds: Joi.string().required(),
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
      parkingtype: Joi.string().required(),
      siteParking: Joi.string().required(),
      reservation: Joi.string().required(),
      priceOfParking: Joi.string().required(),
      breakfast: Joi.string().required(),
      priceOfBreakfast: Joi.string().required(),
      kindOfBreakfast: Joi.string().required(),
      language: Joi.string().required(),
      facillities: Joi.string().required(),
      extraBed: Joi.string().required(),
      selectedNumberOfBed: Joi.string().required(),
      extraBedAccomodateGuest: Joi.string().required(),
      Amenities: Joi.string().required(),
      propertyphoto: Joi.string().required(),
      advanceCancelfreeofCharge: Joi.string().required(),
      CheckInForm: Joi.string().required(),
      CheckOutForm: Joi.string().required(),
      smoking: Joi.string().required(),
      AccomodateChildren: Joi.string().required(),
      minimumStay: Joi.string().required(),
      pets: Joi.string().required(),
      chargesOfPets: Joi.string().required(),
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
      propertyOwnership,
      channelManager,
      nameOfCompany,
      nameOfManager,
      numberOfBedroom,
      numberOfLivingroom,
      numberOfBathroom,
      numberOfAppartments,
      TypeOfAppartments,
      KindOfBeds,
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
      Amenities,
      propertyphoto,
      advanceCancelfreeofCharge,
      CheckInForm,
      CheckOutForm,
      smoking,
      AccomodateChildren,
      minimumStay,
      pets,
      chargesOfPets,
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
    if (propertyOwnership)
      existingAppartment.propertyOwnership = propertyOwnership;
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
    if (TypeOfAppartments)
      existingAppartment.TypeOfAppartments = TypeOfAppartments;
    if (KindOfBeds) existingAppartment.KindOfBeds = KindOfBeds;
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
    if (addressLine2) existingAppartment.addressLine2 = addressLine2;
    if (isParkingAvailable)
      existingAppartment.isParkingAvailable = isParkingAvailable;
    if (parkingtype) existingAppartment.parkingtype = parkingtype;
    if (siteParking) existingAppartment.siteParking = siteParking;
    if (reservation) existingAppartment.reservation = reservation;
    if (priceOfParking) existingAppartment.priceOfParking = priceOfParking;
    if (breakfast)
      existingAppartment.breakfast= breakfast;
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
    if (Amenities) existingAppartment.Amenities = Amenities;
    if (propertyphoto) existingAppartment.propertyphoto = propertyphoto;
    if (advanceCancelfreeofCharge)
      existingAppartment.advanceCancelfreeofCharge = advanceCancelfreeofCharge;
    if (CheckInForm) existingAppartment.CheckInForm = CheckInForm;
    if (CheckOutForm) existingAppartment.CheckOutForm = CheckOutForm;
    if (smoking) existingAppartment.smoking = smoking;
    if (AccomodateChildren)
      existingAppartment.AccomodateChildren = AccomodateChildren;
    if (minimumStay) existingAppartment.minimumStay = minimumStay;
    if (pets) existingAppartment.pets = pets;
    if (chargesOfPets) existingAppartment.chargesOfPets = chargesOfPets;
    await existingAppartment.save();

    return res
      .status(200)
      .json({
        message: " updated successfully",
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
    await appartmentInfo.deleteOne({  _id:appartmentId });
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

      const appartments = await appartmentInfo.find({ hotelId })
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
