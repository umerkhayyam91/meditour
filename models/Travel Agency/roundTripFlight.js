const mongoose = require("mongoose");

const roundTripSchema = new mongoose.Schema(
    {
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Travel Agency",
        },
        outBoundTrip: {
            companyName: {
                type: String,
            },
            flightsNo: {
                type: String,
            },
            companyLogo: {
                type: String,
            },
            from: {
                type: String,
            },
            to: {
                type: String,
            },
            className: {
                type: String,
            },
            departTime: {
                type: String,
            },
            designationTime: {
                type: String,
            },
            passengers: {
                type: String,
            },
            infant: {
                type: String,
            },
            directOrStay: {
                type: String,
                enum: ["direct", "stay"]
            },
            stayDesignation: {
                type: String,
            },
            stayduration: {
                type: String,
            },
            nextFlightNo: {
                type: String,
            },
            afterStayDepartTime: {
                type: String,
            },
            afterStayDesignationTime: {
                type: String,
            },
        },
        returnTrip: {
            companyName: {
                type: String,
            },
            flightsNo: {
                type: String,
            },
            companyLogo: {
                type: String,
            },
            from: {
                type: String,
            },
            to: {
                type: String,
            },
            className: {
                type: String,
            },
            departTime: {
                type: String,
            },
            designationTime: {
                type: String,
            },
            passengers: {
                type: String,
            },
            infant: {
                type: String,
            },
            directOrStay: {
                type: String,
                enum: ["direct", "stay"]
            },
            stayDesignation: {
                type: String,
            },
            stayduration: {
                type: String,
            },
            nextFlightNo: {
                type: String,
            },
            afterStayDepartTime: {
                type: String,
            },
            afterStayDesignationTime: {
                type: String,
            },
        },
        winglets: {
            type: Boolean
        },
        webBrowsing: {
            type: Boolean
        },
        streamingEntertainment: {
            type: Boolean
        },
        lightMealAvailability: {
            flightA: Boolean,
            flightB: Boolean
        },
        handBag: {
            type: String,
            required: true,
        },
        baggageWeight: {
            type: String,
            required: true,
        },
        cancelationDuration: {
            type: String,
            required: true,
        },
        cancelationDeduct: {
            type: String,
            required: true,
        },
        ticketsCount: {
            type: String,
            required: true,
        },
        cancelPolicyDescription: {
            type: String,
            required: true,
        },
        meditourPrice: {
            type: String,
            required: true,
        },
        actualPrice: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Round Trip Flight", roundTripSchema, "round trip flights");