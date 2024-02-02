const express = require("express");
const app = express();
const RoundTripFlightDTO = require("../../dto/travel agency/roundTripFlight");
const RoundTripFlight = require("../../models/Travel Agency/roundTripFlight");
const Joi = require("joi");

const agencyRoundTripController = {
    async addRoundTripFlight(req, res, next) {
        try {
            const roundTripFlightSchema = Joi.object({
                outBoundTrip: Joi.object({
                    companyName: Joi.string().required(),
                    flightsNo: Joi.string(),
                    companyLogo: Joi.string(),
                    from: Joi.string(),
                    to: Joi.string(),
                    className: Joi.string(),
                    departTime: Joi.string().required(),
                    designationTime: Joi.string().required(),
                    passengers: Joi.string().required(),
                    infant: Joi.string().required(),
                    directOrStay: Joi.string().valid('direct', 'stay'),
                    stayDesignation: Joi.string(),
                    stayduration: Joi.string(),
                    nextFlightNo: Joi.string(),
                    afterStayDepartTime: Joi.string().required(),
                    afterStayDesignationTime: Joi.string().required(),
                }).required(),

                returnTrip: Joi.object({
                    companyName: Joi.string().required(),
                    flightsNo: Joi.string(),
                    companyLogo: Joi.string(),
                    from: Joi.string(),
                    to: Joi.string(),
                    className: Joi.string(),
                    departTime: Joi.string().required(),
                    designationTime: Joi.string().required(),
                    passengers: Joi.string().required(),
                    infant: Joi.string().required(),
                    directOrStay: Joi.string().valid('direct', 'stay'),
                    stayDesignation: Joi.string(),
                    stayduration: Joi.string(),
                    nextFlightNo: Joi.string(),
                    afterStayDepartTime: Joi.string().required(),
                    afterStayDesignationTime: Joi.string().required(),
                }).required(),

                winglets: Joi.boolean(),
                webBrowsing: Joi.boolean(),
                streamingEntertainment: Joi.boolean(),
                lightMealAvailability: Joi.object({
                    flightA: Joi.boolean(),
                    flightB: Joi.boolean(),
                }),
                handBag: Joi.string().required(),
                baggageWeight: Joi.string().required(),
                cancelationDuration: Joi.string().required(),
                cancelationDeduct: Joi.string().required(),
                ticketsCount: Joi.string().required(),
                cancelPolicyDescription: Joi.string().required(),
                meditourPrice: Joi.string().required(),
                actualPrice: Joi.string().required(),
            });

            const { error } = roundTripFlightSchema.validate(req.body);

            if (error) {
                return next(error);
            }

            const {
                outBoundTrip,
                returnTrip,
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
                actualPrice,
            } = req.body;

            // Get agencyId from the authenticated user
            const agencyId = req.user._id;

            // Create a new RoundTripFlight instance
            const flightToRegister = new RoundTripFlight({
                agencyId,
                outBoundTrip,
                returnTrip,
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
                actualPrice,
            });

            // Save the new RoundTripFlight
            const flight = await flightToRegister.save();

            // Create and send the response
            const flightDto = new RoundTripFlightDTO(flight);
            return res.status(201).json({ flight: flightDto, auth: true });
        } catch (error) {
            // Handle errors
            return next(error);
        }
    },

    async editRoundTripFlight(req, res, next) {
        try {
          const roundTripFlightSchema = Joi.object({
            outBoundTrip: Joi.object({
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
              directOrStay: Joi.string().valid('direct', 'stay'),
              stayDesignation: Joi.string(),
              stayduration: Joi.string(),
              nextFlightNo: Joi.string(),
              afterStayDepartTime: Joi.string(),
              afterStayDesignationTime: Joi.string(),
            }),
      
            returnTrip: Joi.object({
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
              directOrStay: Joi.string().valid('direct', 'stay'),
              stayDesignation: Joi.string(),
              stayduration: Joi.string(),
              nextFlightNo: Joi.string(),
              afterStayDepartTime: Joi.string(),
              afterStayDesignationTime: Joi.string(),
            }),
      
            winglets: Joi.boolean(),
            webBrowsing: Joi.boolean(),
            streamingEntertainment: Joi.boolean(),
            lightMealAvailability: Joi.object({
              flightA: Joi.boolean(),
              flightB: Joi.boolean(),
            }),
            handBag: Joi.string(),
            baggageWeight: Joi.string(),
            cancelationDuration: Joi.string(),
            cancelationDeduct: Joi.string(),
            ticketsCount: Joi.string(),
            cancelPolicyDescription: Joi.string(),
            meditourPrice: Joi.string(),
            actualPrice: Joi.string()
          });
      
          const { error } = roundTripFlightSchema.validate(req.body);
      
          if (error) {
            return next(error);
          }
      
          const {
            outBoundTrip,
            returnTrip,
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
            actualPrice,
          } = req.body;
      
          const flightId = req.query.flightId;
          const existingFlight = await RoundTripFlight.findById(flightId);
      
          if (!existingFlight) {
            const error = new Error("Flight not found!");
            error.status = 404;
            return next(error);
          }
      
          // fields
          if (outBoundTrip) existingFlight.outBoundTrip = outBoundTrip;
          if (returnTrip) existingFlight.returnTrip = returnTrip;
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
        } catch (error) {
          // Handle errors
          return next(error);
        }
      },

    async deleteRoundTripFlight(req, res, next) {
        const flightId = req.query.flightId;
        const existingAppartment = await RoundTripFlight.findById(flightId);

        if (!existingAppartment) {
            const error = new Error("Flight not found!");
            error.status = 404;
            return next(error);
        }
        await RoundTripFlight.deleteOne({ _id: flightId });
        return res.status(200).json({ message: "Flight deleted successfully" });
    },

    async getRoundTripFlight(req, res, next) {
        try {
            const flightId = req.query.flightId;
            const flight = await RoundTripFlight.findById(flightId);

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

    async getAllRoundTripFlight(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const flightsPerPage = 10;
            const agencyId = req.user._id;
            const totalFlights = await RoundTripFlight.countDocuments({
                agencyId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalFlights / flightsPerPage); // Calculate the total number of pages

            const skip = (page - 1) * flightsPerPage; // Calculate the number of posts to skip based on the current page

            const flights = await RoundTripFlight.find({ agencyId })
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

module.exports = agencyRoundTripController;
