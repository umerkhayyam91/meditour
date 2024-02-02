const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Travel Agency",
        },
        packageName: {
            type: String,
        },
        packageDuration: {
            type: String,
        },
        from: {
            type: String,
        },
        to: {
            type: String,
        },
        departTime: {
            type: String,
        },
        designationTime: {
            type: String,
        },
        className: {
            type: String,
        },

        breakfastQuantity: {
            type: String,
        },
        lunchQuantity: {
            type: String,
        },
        dinnerQuantity: {
            type: String,
        },
        dayByDayPlans: {
            type: String,
        },
        recentTourPolicy: {
            type: String,
        },
        actualPricePerHead: {
            type: String,
        },
        meditourPricePerHead: {
            type: String,
        },
        actualPricePerCouple: {
            type: String,
        },
        meditourPricePerCouple: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Agency Tour", tourSchema, "agency tours");