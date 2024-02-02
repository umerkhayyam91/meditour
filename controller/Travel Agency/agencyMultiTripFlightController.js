const express = require("express");
const app = express();
const MultiTripFlightDTO = require("../../dto/travel agency/multiTripFlight");
const MultiTripFlight = require("../../models/Travel Agency/multiTripFlight");
const Joi = require("joi");

const agencyMultiTripController = {
    async addMultiTripFlight(req, res, next) {
        try {
            const multiTripSchema = Joi.object({
                trips: Joi.array().items({
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
                    directOrStay: Joi.string().valid('direct', 'stay'),
                    stayDesignation: Joi.string(),
                    stayduration: Joi.string(),
                    nextFlightNo: Joi.string(),
                    afterStayDepartTime: Joi.string(),
                    afterStayDesignationTime: Joi.string(),
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

            const { error } = multiTripSchema.validate(req.body);

            if (error) {
                return next(error);
            }

            const {
                trips,
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
            const agencyId = req.user._id;

            const multiTripFlightToRegister = new MultiTripFlight({
                agencyId,
                trips,
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
            const multiTripFlight = await multiTripFlightToRegister.save();
            const flightDto = new MultiTripFlightDTO(multiTripFlight);

            return res.status(201).json({ flight: flightDto, auth: true });
        } catch (error) {
            return next(error);
        }
    },

    // Update Multi-Trip Flight
    async editMultiTripFlight(req, res, next) {
        try {
            const multiTripSchema = Joi.object({
                trips: Joi.array().items({
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

            const { error } = multiTripSchema.validate(req.body);

            if (error) {
                return next(error);
            }

            const {
                trips,
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
            const existingMultiTripFlight = await MultiTripFlight.findById(flightId);

            if (!existingMultiTripFlight) {
                const error = new Error("Flight not found!");
                error.status = 404;
                return next(error);
            }

            if (trips) existingMultiTripFlight.trips = trips;
            if (winglets) existingMultiTripFlight.winglets = winglets;
            if (webBrowsing) existingMultiTripFlight.webBrowsing = webBrowsing;
            if (streamingEntertainment) existingMultiTripFlight.streamingEntertainment = streamingEntertainment;
            if (lightMealAvailability) existingMultiTripFlight.lightMealAvailability = lightMealAvailability;
            if (handBag) existingMultiTripFlight.handBag = handBag;
            if (baggageWeight) existingMultiTripFlight.baggageWeight = baggageWeight;
            if (cancelationDuration) existingMultiTripFlight.cancelationDuration = cancelationDuration;
            if (ticketsCount) existingMultiTripFlight.ticketsCount = ticketsCount;
            if (cancelPolicyDescription) existingMultiTripFlight.cancelPolicyDescription = cancelPolicyDescription;
            if (meditourPrice) existingMultiTripFlight.meditourPrice = meditourPrice;
            if (actualPrice) existingMultiTripFlight.actualPrice = actualPrice;


            await existingMultiTripFlight.save();

            return res.status(200).json({
                message: "Flight updated successfully",
                multiTripFlight: existingMultiTripFlight,
            });
        } catch (error) {
            return next(error);
        }
    },

    async deleteMultiTripFlight(req, res, next) {
        const flightId = req.query.flightId;
        const existingAppartment = await MultiTripFlight.findById(flightId);

        if (!existingAppartment) {
            const error = new Error("Flight not found!");
            error.status = 404;
            return next(error);
        }
        await MultiTripFlight.deleteOne({ _id: flightId });
        return res.status(200).json({ message: "Flight deleted successfully" });
    },

    async getMultiTripFlight(req, res, next) {
        try {
            const flightId = req.query.flightId;
            const flight = await MultiTripFlight.findById(flightId);

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

    async getAllMultiTripFlight(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const flightsPerPage = 10;
            const agencyId = req.user._id;
            const totalFlights = await MultiTripFlight.countDocuments({
                agencyId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalFlights / flightsPerPage); // Calculate the total number of pages

            const skip = (page - 1) * flightsPerPage; // Calculate the number of posts to skip based on the current page

            const flights = await MultiTripFlight.find({ agencyId })
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

module.exports = agencyMultiTripController;
