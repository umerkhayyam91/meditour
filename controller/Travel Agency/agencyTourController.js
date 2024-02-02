const express = require("express");
const app = express();
const TourDTO = require("../../dto/travel agency/tour");
const Tour = require("../../models/Travel Agency/tour");
const Joi = require("joi");

const agencyOneWayFlightController = {
    async addTour(req, res, next) {
        const tourSchema = Joi.object({
            packageName: Joi.string().required(),
            packageDuration: Joi.string().required(),
            from: Joi.string().required(),
            to: Joi.string().required(),
            departTime: Joi.string().required(),
            designationTime: Joi.string().required(),
            className: Joi.string().required(),
            breakfastQuantity: Joi.string().required(),
            lunchQuantity: Joi.string().required(),
            dinnerQuantity: Joi.string(),
            dayByDayPlans: Joi.string(),
            recentTourPolicy: Joi.string(),
            actualPricePerHead: Joi.string(),
            meditourPricePerHead: Joi.string(),
            actualPricePerCouple: Joi.string(),
            meditourPricePerCouple: Joi.string(),
        });
        const { error } = tourSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        const {
            packageName,
            packageDuration,
            from,
            to,
            departTime,
            designationTime,
            className,
            breakfastQuantity,
            lunchQuantity,
            dinnerQuantity,
            dayByDayPlans,
            recentTourPolicy,
            actualPricePerHead,
            meditourPricePerHead,
            actualPricePerCouple,
            meditourPricePerCouple
        } = req.body;
        let tour;
        const agencyId = req.user._id;
        try {
            const tourToRegister = new Tour({
                agencyId,
                packageName,
                packageDuration,
                from,
                to,
                departTime,
                designationTime,
                className,
                breakfastQuantity,
                lunchQuantity,
                dinnerQuantity,
                dayByDayPlans,
                recentTourPolicy,
                actualPricePerHead,
                meditourPricePerHead,
                actualPricePerCouple,
                meditourPricePerCouple
            });

            tour = await tourToRegister.save();
        } catch (error) {
            return next(error);
        }
        const tourDto = new TourDTO(tour);

        return res.status(201).json({ tour: tourDto, auth: true });
    },
    // update
    async editTour(req, res, next) {
        const tourSchema = Joi.object({
            packageName: Joi.string(),
            packageDuration: Joi.string(),
            from: Joi.string(),
            to: Joi.string(),
            departTime: Joi.string(),
            designationTime: Joi.string(),
            className: Joi.string(),
            breakfastQuantity: Joi.string(),
            lunchQuantity: Joi.string(),
            dinnerQuantity: Joi.string(),
            dayByDayPlans: Joi.string(),
            recentTourPolicy: Joi.string(),
            actualPricePerHead: Joi.string(),
            meditourPricePerHead: Joi.string(),
            actualPricePerCouple: Joi.string(),
            meditourPricePerCouple: Joi.boolean(),
        });
        const { error } = tourSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        const {
            packageName,
            packageDuration,
            from,
            to,
            departTime,
            designationTime,
            className,
            breakfastQuantity,
            lunchQuantity,
            dinnerQuantity,
            dayByDayPlans,
            recentTourPolicy,
            actualPricePerHead,
            meditourPricePerHead,
            actualPricePerCouple,
            meditourPricePerCouple
        } = req.body;

        const tourId = req.query.tourId;
        const existingTour = await Tour.findById(tourId);

        if (!existingTour) {
            const error = new Error("Tour not found!");
            error.status = 404;
            return next(error);
        }
        // fields


        if (packageName) existingTour.packageName = packageName;
        if (packageDuration) existingTour.packageDuration = packageDuration;
        if (from) existingTour.from = from;
        if (to) existingTour.to = to;
        if (departTime) existingTour.departTime = departTime;
        if (designationTime) existingTour.designationTime = designationTime;
        if (className) existingTour.className = className;
        if (breakfastQuantity) existingTour.breakfastQuantity = breakfastQuantity;
        if (lunchQuantity) existingTour.lunchQuantity = lunchQuantity;
        if (dinnerQuantity) existingTour.dinnerQuantity = dinnerQuantity;
        if (dayByDayPlans) existingTour.dayByDayPlans = dayByDayPlans;
        if (recentTourPolicy) existingTour.recentTourPolicy = recentTourPolicy;
        if (actualPricePerHead) existingTour.actualPricePerHead = actualPricePerHead;
        if (meditourPricePerHead) existingTour.meditourPricePerHead = meditourPricePerHead;
        if (actualPricePerCouple) existingTour.actualPricePerCouple = actualPricePerCouple;
        if (meditourPricePerCouple) existingTour.meditourPricePerCouple = meditourPricePerCouple;

        await existingTour.save();

        return res
            .status(200)
            .json({
                message: "Tour updated successfully",
                tour: existingTour,
            });
    },

    async deleteTour(req, res, next) {
        const tourId = req.query.tourId;
        const existingTour = await Tour.findById(tourId);

        if (!existingTour) {
            const error = new Error("Tour not found!");
            error.status = 404;
            return next(error);
        }
        await Tour.deleteOne({ _id: tourId });
        return res.status(200).json({ message: "Tour deleted successfully" });
    },

    async getTour(req, res, next) {
        try {
            const tourId = req.query.tourId;
            const tour = await Tour.findById(tourId);

            if (!tour) {
                const error = new Error("Tour not found!");
                error.status = 404;
                return next(error);
            }
            return res.status(200).json({ tour });
        } catch (error) {
            return next(error);
        }
    },

    async getAllTour(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const toursPerPage = 10;
            const agencyId = req.user._id;
            const totalTours = await Tour.countDocuments({
                agencyId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalTours / toursPerPage); // Calculate the total number of pages

            const skip = (page - 1) * toursPerPage; // Calculate the number of posts to skip based on the current page

            const tours = await Tour.find({ agencyId })
                .skip(skip)
                .limit(toursPerPage);
            let previousPage = page > 1 ? page - 1 : null;
            let nextPage = page < totalPages ? page + 1 : null;
            return res.status(200).json({
                tours: tours,
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
