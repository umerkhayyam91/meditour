const AgencyBooking = require("../../models/Travel Agency/booking")
const moment = require("moment");

const agencyRequestController = {
    async dashDetails(req, res, next) {
        try {
            const currentDate = new Date();
            // Set the time to the beginning of the days
            currentDate.setHours(0, 0, 0, 0);
            const lastMonth = moment(currentDate).subtract(30, "days");
            const agencyId = req.user._id;
            const todayFlightBooking = await AgencyBooking.countDocuments({
                createdAt: { $gte: currentDate, $lt: new Date() },
                agencyId,
                requestType: "flight"
              })
            const todayTourBooking = await AgencyBooking.countDocuments({
                createdAt: { $gte: currentDate, $lt: new Date() },
                agencyId,
                requestType: "tour"
              })
              const lastMonthFlightBooking = await AgencyBooking.countDocuments({
                createdAt: { $gte: lastMonth, $lt: new Date() },
                agencyId,
                requestType: "flight"
              })
              const lastMonthTourBooking = await AgencyBooking.countDocuments({
                createdAt: { $gte: lastMonth, $lt: new Date() },
                agencyId,
                requestType: "tour"
              })
        } catch (error) {
            return next(error);
        }
    },


    //.............dummy api................//
    async addRequests(req, res, next) {
        const { agencyId, userId, from, to, actualPrice, packageName, totalUser } = req.body;
        const tourId = req.query.tourId;
        // insuranceCompanyId = req.user._id;
        const request = new AgencyRequest({
            agencyId,
            userId,
            from,
            to,
            actualPrice,
            packageName,
            totalUser,
            tourId,
            requestType: "flight"
        })
        await request.save();
        res.status(200).json({
            request: request,
            auth: true,
        });
    }
}

module.exports = agencyRequestController;