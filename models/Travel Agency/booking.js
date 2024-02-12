const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        //both fields(flight and tour)//
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Travel Agency",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        from: {
            type: String,
        },
        to: {
            type: String,
        },
        actualPrice: {
            type: String,
        },
        requestType: {
            type: String,
            enum: ["flight", "tour"]
        },

        //tour fields only//
        packageName: {
            type: String,
        },
        totalUser: {
            type: String,
        },
        tourId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agency Tour"
        },

        //flight fields only//
        flightID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flight"
        },
        departDate: {
            type: String,
        },
        plan: {
            type: String,
        },
        className: {
            type: String,
        },
        status: {
            type: String,
            enum: ["sold-out", "refund"]
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model(
    "Agency Booking",
    bookingSchema,
    "agency bookings"
);
