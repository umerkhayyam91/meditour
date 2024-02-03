const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    companyName: String,
    flightsNo: String,
    companyLogo: String,
    from: String,
    to: String,
    className: String,
    departTime: String,
    designationTime: String,
    passengers: String,
    infant: String,
    directOrStay: {
        type: String,
        enum: ["direct", "stay"]
    },
    stayDesignation: String,
    stayduration: String,
    nextFlightNo: String,
    afterStayDepartTime: String,
    afterStayDesignationTime: String,
});

const flightSchema = new mongoose.Schema(
    {
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Travel Agency",
        },
        trips: [tripSchema],
        winglets: Boolean,
        webBrowsing: Boolean,
        streamingEntertainment: Boolean,
        lightMealAvailability: {
            flightA: Boolean,
            flightB: Boolean,
        },
        handBag: {
            type: String,
        },
        baggageWeight: {
            type: String,
        },
        cancelationDuration: {
            type: String,
        },
        cancelationDeduct: {
            type: String,
        },
        ticketsCount: {
            type: String,
        },
        cancelPolicyDescription: {
            type: String,
        },
        meditourPrice: {
            type: String,
        },
        actualPrice: {
            type: String,
        },
        flightType: {
            type: String,
            enum: ["oneWay", "round", "multi"]
        },
    },
    {
        timestamps: true,
    }
);
 
module.exports = mongoose.model("Flight", flightSchema, "flights");
