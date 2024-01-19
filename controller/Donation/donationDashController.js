const Package = require("../../models/Donation/package.js");
const User = require("../../models/user.js");
const DonorList = require("../../models/Donation/donorList.js");
const moment = require("moment");

async function getAmountCountForWeek(donationId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    try {
      const result = await DonorList.aggregate([
        {
          $match: {
            donationId,
            createdAt: { $gte: currentDate.toDate(), $lt: nextDate.toDate() },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$donationAmount",
            },
          },
        },
      ]);

      let totalAmount = 0;

      if (result.length > 0) {
        totalAmount = result[0].totalAmount;
        console.log(`Total Donation Amount: ${totalAmount}`);
      } else {
        console.log("No documents found for the specified donationId.");
      }

      days.push({
        date: currentDate.format("YYYY-MM-DD"),
        totalAmount: totalAmount,
      });
    } catch (error) {
      console.error("Error:", error);
    }

    currentDate.add(1, "days");
  }

  return days;
}

const docDashController = {
  async dashDetails(req, res, next) {
    try {
      const donationId = req.user._id;
      const result = await DonorList.aggregate([
        {
          $match: {
            donationId,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$donationAmount",
            },
          },
        },
      ]);

      let totalAmount = 0;

      if (result.length > 0) {
        totalAmount = result[0].totalAmount;
        console.log(`Total Donation Amount: ${totalAmount}`);
      } else {
        console.log("No documents found for the specified donationId.");
      }

      const uniqueUserDocs = await DonorList.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
        { $count: "uniqueUserIds" },
      ]);

      const totalPackages = await Package.countDocuments({ donationId });
      res.json({
        totalAmount,
        totalDonors: uniqueUserDocs[0].uniqueUserIds,
        totalPackages,
      });
    } catch (error) {
      next(error);
    }
  },

  async graph(req, res, next) {
    try {
      // Calculate date ranges for the current week (including previous 7 days) and previous week
      const today = moment().startOf("day");
      const currentWeekStart = moment(today).subtract(7, "days").startOf("day");
      const currentWeekEnd = moment(today).endOf("day");
      const previousWeekStart = moment(currentWeekStart).subtract(7, "days");
      const previousWeekEnd = moment(currentWeekStart).subtract(1, "days");

      // Fetch data for the current week (including previous 7 days)
      const currentWeekData = await getAmountCountForWeek(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );

      //   // Fetch data for the previous week
      //   const previousWeekData = await getAppCountForWeek(
      //     req.user._id,
      //     previousWeekStart,
      //     previousWeekEnd
      //   );

      res.json({ currentWeekData });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = docDashController;
