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
    const { error } = homeInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      guestBook,
      similarPropertyCategory,
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
    let home;
    const hotelId = req.user._id;
    try {
      const homeInfoToRegister = new homeInfo({
        hotelId,
        guestBook,
      similarPropertyCategory,
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
      guestBook: Joi.string().required(),
      similarPropertyCategory: Joi.string().required(),
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
    const { error } = homeInfoSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      guestBook,
      similarPropertyCategory,
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
    if (customName) existingHome.customName = customName;
    if (contactNumber) existingHome.contactNumber = contactNumber;
    if (streetAddress) existingHome.streetAddress = streetAddress;
    if (addressLine2) existingHome.addressLine2 = addressLine2;
    if (city) existingHome.city = city;
    if (postCode) existingHome.postCode = postCode;
    if (country) existingHome.country = country;
    if (partOfCompany) existingHome.partOfCompany = partOfCompany;
    if (channelManager) existingHome.channelManager = channelManager;
    if (nameOfCompany) existingHome.nameOfCompany = nameOfCompany;
    if (nameOfManager) existingHome.nameOfManager = nameOfManager;
    if (numberOfBedroom) existingHome.numberOfBedroom = numberOfBedroom;
    if (numberOfLivingroom)
      existingHome.numberOfLivingroom = numberOfLivingroom;
    if (numberOfBathroom)
      existingHome.numberOfBathroom = numberOfBathroom;
    if (numberOfAppartments)
      existingHome.numberOfAppartments = numberOfAppartments;
    if (typeOfAppartments)
      existingHome.typeOfAppartments = typeOfAppartments;
    if (kindOfBeds) existingHome.kindOfBeds = kindOfBeds;
    if (numberOfBed) existingHome.numberOfBed = numberOfBed;
    if (addAnotherBed) existingHome.addAnotherBed = addAnotherBed;
    if (ownerImage) existingHome.ownerImage = ownerImage;
    if (cnicImage) existingHome.cnicImage = cnicImage;
    if (taxFileImage) existingHome.taxFileImage = taxFileImage;
    if (noOfStayingGuests)
      existingHome.noOfStayingGuests = noOfStayingGuests;
    if (privateBathroom) existingHome.privateBathroom = privateBathroom;
    if (numberOfSofaBed) existingHome.numberOfSofaBed = numberOfSofaBed;
    if (guest) existingHome.guest = guest;
    if (appartmentSize) existingHome.appartmentSize = appartmentSize;
    if (basePricePerNight) existingHome.basePricePerNight = basePricePerNight;
    if (isParkingAvailable)
      existingHome.isParkingAvailable = isParkingAvailable;
    if (parkingtype) existingHome.parkingtype = parkingtype;
    if (siteParking) existingHome.siteParking = siteParking;
    if (reservation) existingHome.reservation = reservation;
    if (priceOfParking) existingHome.priceOfParking = priceOfParking;
    if (breakfast) existingHome.breakfast = breakfast;
    if (priceOfBreakfast)
      existingHome.priceOfBreakfast = priceOfBreakfast;
    if (kindOfBreakfast) existingHome.kindOfBreakfast = kindOfBreakfast;
    if (language) existingHome.language = language;
    if (facillities) existingHome.facillities = facillities;
    if (extraBed) existingHome.extraBed = extraBed;
    if (selectedNumberOfBed)
      existingHome.selectedNumberOfBed = selectedNumberOfBed;
    if (extraBedAccomodateGuest)
      existingHome.extraBedAccomodateGuest = extraBedAccomodateGuest;
    if (amenities) existingHome.amenities = amenities;
    if (propertyphoto) existingHome.propertyphoto = propertyphoto;
    if (advanceCancelfreeofCharge)
      existingHome.advanceCancelfreeofCharge = advanceCancelfreeofCharge;
    if (checkInForm) existingHome.checkInForm = checkInForm;
    if (checkOutForm) existingHome.checkOutForm = checkOutForm;
    if (smoking) existingHome.smoking = smoking;
    if (accomodateChildren)
      existingHome.accomodateChildren = accomodateChildren;
    if (minimumStay) existingHome.minimumStay = minimumStay;
    if (pets) existingHome.pets = pets;
    if (chargesOfPets) existingHome.chargesOfPets = chargesOfPets;
    if (addAnotherProperty) existingHome.addAnotherProperty = addAnotherProperty;

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
