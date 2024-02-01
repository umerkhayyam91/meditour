const express = require("express");
const app = express();
const OneWayFlightDTO = require("../../dto/travel agency/oneWayFlight");
const OneWayFlight = require("../../models/Travel Agency/oneWayFlight");
const Joi = require("joi");

const agencyOneWayFlightController = {
  async addOneWayFlight(req, res, next) {
    const oneWayFlightSchema = Joi.object({
      companyName: Joi.string().required(),
      flightsNo: Joi.string().required(),
      companyLogo: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
      className: Joi.string().required(),
      departTime: Joi.string().required(),
      designationTime: Joi.string().required(),
      passengers: Joi.string().required(),
      infant: Joi.string().required(),
      directOrStay: Joi.string(),
      stayDesignation: Joi.string(),
      stayduration: Joi.string(),
      nextFlightNo: Joi.string(),
      afterStayDepartTime: Joi.string(),
      afterStayDesignationTime: Joi.string(),
      winglets: Joi.boolean(),
      webBrowsing: Joi.boolean(),
      streamingEntertainment: Joi.boolean(),
      lightMealAvailability: Joi.object(),
      handBag: Joi.string().required(),
      baggageWeight: Joi.string().required(),
      cancelationDuration: Joi.string().required(),
      cancelationDeduct: Joi.string().required(),
      ticketsCount: Joi.string().required(),
      cancelPolicyDescription: Joi.string().required(),
      meditourPrice: Joi.string().required(),
      actualPrice: Joi.string().required()
    });
    const { error } = oneWayFlightSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      companyName,
      flightsNo,
      companyLogo,
      from,
      to,
      className,
      departTime,
      designationTime,
      passengers,
      infant,
      directOrStay,
      stayDesignation,
      stayduration,
      nextFlightNo,
      afterStayDepartTime,
      afterStayDesignationTime,
      winglets,
      webBrowsing,
      streamingEntertainment,
      lightMealAvailability,
      handBag,
      baggageWeight,
      cancelationDuration,
      cancelationDeduct,
      ticketsCount,
      cancelPolicyDescription,
      meditourPrice,
      actualPrice
    } = req.body;
    let flight;
    const agencyId = req.user._id;
    try {
      const flightToRegister = new OneWayFlight({
        agencyId,
        companyName,
        flightsNo,
        companyLogo,
        from,
        to,
        className,
        departTime,
        designationTime,
        passengers,
        infant,
        directOrStay,
        stayDesignation,
        stayduration,
        nextFlightNo,
        afterStayDepartTime,
        afterStayDesignationTime,
        winglets,
        webBrowsing,
        streamingEntertainment,
        lightMealAvailability,
        handBag,
        baggageWeight,
        cancelationDuration,
        cancelationDeduct,
        ticketsCount,
        cancelPolicyDescription,
        meditourPrice,
        actualPrice
      });

      flight = await flightToRegister.save();
    } catch (error) {
      return next(error);
    }
    const flightDto = new OneWayFlightDTO(flight);

    return res.status(201).json({ flight: flightDto, auth: true });
  },
  // update
  async editOneWayFlight(req, res, next) {
    const oneWayFlightSchema = Joi.object({
      companyName: Joi.string(),
      flightsNo: Joi.string(),
      companyLogo: Joi.string(),
      from: Joi.string(),
      to: Joi.string(),
      className: Joi.string(),
      departTime: Joi.string(),
      designationTime: Joi.string(),
      passengers: Joi.string(),
      infant: Joi.string(),
      directOrStay: Joi.string(),
      stayDesignation: Joi.string(),
      stayduration: Joi.string(),
      nextFlightNo: Joi.string(),
      afterStayDepartTime: Joi.string(),
      afterStayDesignationTime: Joi.string(),
      winglets: Joi.boolean(),
      webBrowsing: Joi.boolean(),
      streamingEntertainment: Joi.boolean(),
      lightMealAvailability: Joi.object(),
      handBag: Joi.string(),
      baggageWeight: Joi.string(),
      cancelationDuration: Joi.string(),
      cancelationDeduct: Joi.string(),
      ticketsCount: Joi.string(),
      cancelPolicyDescription: Joi.string(),
      meditourPrice: Joi.string(),
      actualPrice: Joi.string()
    });
    const { error } = oneWayFlightSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      companyName,
      flightsNo,
      companyLogo,
      from,
      to,
      className,
      departTime,
      designationTime,
      passengers,
      infant,
      directOrStay,
      stayDesignation,
      stayduration,
      nextFlightNo,
      afterStayDepartTime,
      afterStayDesignationTime,
      winglets,
      webBrowsing,
      streamingEntertainment,
      lightMealAvailability,
      handBag,
      baggageWeight,
      cancelationDuration,
      cancelationDeduct,
      ticketsCount,
      cancelPolicyDescription,
      meditourPrice,
      actualPrice
    } = req.body;

    const flightId = req.query.flightId;
    const existingFlight = await OneWayFlight.findById(flightId);

    if (!existingFlight) {
      const error = new Error("Flight not found!");
      error.status = 404;
      return next(error);
    }
    // fields


    if (companyName) existingFlight.companyName = companyName;
    if (flightsNo) existingFlight.flightsNo = flightsNo;
    if (companyLogo) existingFlight.companyLogo = companyLogo;
    if (from) existingFlight.from = from;
    if (to) existingFlight.to = to;
    if (className) existingFlight.className = className;
    if (departTime) existingFlight.departTime = departTime;
    if (designationTime) existingFlight.designationTime = designationTime;
    if (passengers) existingFlight.passengers = passengers;
    if (infant) existingFlight.infant = infant;
    if (directOrStay) existingFlight.directOrStay = directOrStay;
    if (stayDesignation) existingFlight.stayDesignation = stayDesignation;
    if (stayduration) existingFlight.stayduration = stayduration;
    if (nextFlightNo) existingFlight.nextFlightNo = nextFlightNo;
    if (afterStayDepartTime) existingFlight.afterStayDepartTime = afterStayDepartTime;
    if (afterStayDesignationTime) existingFlight.afterStayDesignationTime = afterStayDesignationTime;
    if (winglets !== undefined) existingFlight.winglets = winglets;
    if (webBrowsing !== undefined) existingFlight.webBrowsing = webBrowsing;
    if (streamingEntertainment !== undefined) existingFlight.streamingEntertainment = streamingEntertainment;
    if (lightMealAvailability) existingFlight.lightMealAvailability = lightMealAvailability;
    if (handBag) existingFlight.handBag = handBag;
    if (baggageWeight) existingFlight.baggageWeight = baggageWeight;
    if (cancelationDuration) existingFlight.cancelationDuration = cancelationDuration;
    if (cancelationDeduct) existingFlight.cancelationDeduct = cancelationDeduct;
    if (ticketsCount) existingFlight.ticketsCount = ticketsCount;
    if (cancelPolicyDescription) existingFlight.cancelPolicyDescription = cancelPolicyDescription;
    if (meditourPrice) existingFlight.meditourPrice = meditourPrice;
    if (actualPrice) existingFlight.actualPrice = actualPrice;

    await existingFlight.save();

    return res
      .status(200)
      .json({
        message: "Flight updated successfully",
        flight: existingFlight,
      });
  },

  async deleteOneWayFlight(req, res, next) {
    const flightId = req.query.flightId;
    const existingAppartment = await OneWayFlight.findById(flightId);

    if (!existingAppartment) {
      const error = new Error("Flight not found!");
      error.status = 404;
      return next(error);
    }
    await OneWayFlight.deleteOne({ _id: flightId });
    return res.status(200).json({ message: "Flight deleted successfully" });
  },

  async getOneWayFlight(req, res, next) {
    try {
      const flightId = req.query.flightId;
      const flight = await OneWayFlight.findById(flightId);

      if (!flight) {
        const error = new Error("Flight not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ flight });
    } catch (error) {
      return next(error);
    }
  },

  async getAllOneWayFlight(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const flightsPerPage = 10;
      const agencyId = req.user._id;
      const totalFlights = await OneWayFlight.countDocuments({
        agencyId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalFlights / flightsPerPage); // Calculate the total number of pages

      const skip = (page - 1) * flightsPerPage; // Calculate the number of posts to skip based on the current page

      const flights = await OneWayFlight.find({ agencyId })
        .skip(skip)
        .limit(flightsPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        flights: flights,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = agencyOneWayFlightController;
