const vehicleRequest = require("../../models/Rent A Car/vehicleRequest");
const moment = require("moment");
const acceptedRequests = require("../../models/Rent A Car/acceptedRequests");

// // today request
// async function getRequestCountForWeek(rentACarId, startDate, endDate) {
//   const days = [];
//   let currentDate = moment(startDate);

//   while (currentDate.isSameOrBefore(endDate)) {
//     const nextDate = moment(currentDate).endOf("day");
//     // Modify this query based on your actual data structure
//     const ordersCount = await veh
//       .find({
//         createdAt: { $gte: currentDate, $lt: nextDate },
//         rentACarId: rentACarId,
//       })
//       .countDocuments();

//     days.push({
//       date: currentDate.format("YYYY-MM-DD"),
//       ordersCount,
//     });

//     currentDate.add(1, "days");
//   }

//   return days;
// }

async function getCustomerCountsForMonths(rentACarId, startDate, endDate) {
  const months = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextMonth = moment(currentDate).endOf("month");
    // Modify this query based on your actual data structure
    const distinctCustomerIds = await acceptedRequests.distinct("userId", {
      createdAt: { $gte: currentDate, $lt: nextMonth },
      rentACarId: rentACarId,
    });

    const customersCount = distinctCustomerIds.length;

    months.push({
      month: currentDate.format("YYYY-MM"),
      customersCount,
    });

    currentDate.add(1, "months");
  }

  return months;
}
const rentCarDashController = {
  async dashDetails(req, res, next) {
    try {
      const rentACarId = req.user._id;
      const currentDate = new Date();
      // Set the time to the beginning of the day
      currentDate.setHours(0, 0, 0, 0);

      //.......todayRequestCount......///
      const todayRequestCount = await vehicleRequest
        .countDocuments({
          createdAt: { $gte: currentDate, $lt: new Date() },
          rentACarId,
        })
      console.log(todayRequestCount);

      //  ............total requests.........//

      const lastWeek = new Date(currentDate);
      lastWeek.setDate(currentDate.getDate() - 7);

      const totalRequests = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastWeek, $lt: currentDate },
      });

      //  ............total pending requests.........//
      const lastPenWeek = new Date(currentDate);
      lastPenWeek.setDate(currentDate.getDate() - 7);

      const totalPenCount = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastPenWeek, $lt: currentDate },
        status: "pending",
      });
      
      let percentageChange;
      if (lastWeek === 0) {
        percentageChange = totalRequests * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        percentageChange = (((totalRequests - totalPenCount) / totalPenCount) * 100).toFixed(2);
      }

      if (percentageChange > 0) {
        percentageChange = "+" + percentageChange + "%";
      } else {
        percentageChange = percentageChange + "%";
      }

      //  ............total cancelled requests.........//
      const lastCancWeek = new Date(currentDate);
      lastCancWeek.setDate(currentDate.getDate() - 7);
      const totalCanCount = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastCancWeek, $lt: currentDate },
        status: "cancelled",
      });
      
      let cancelPercentageChange;
      if (lastCancWeek === 0) {
        cancelPercentageChange = totalCanCount * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        cancelPercentageChange = (((totalCanCount - lastCancWeek) / lastCancWeek) * 100).toFixed(2);
      }

      if (cancelPercentageChange > 0) {
        cancelPercentageChange = "+" + cancelPercentageChange + "%";
      } else {
        cancelPercentageChange = cancelPercentageChange + "%";
      }

      let pendingPercentageChange;
      if (lastPenWeek === 0) {
        pendingPercentageChange = totalPenCount * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        pendingPercentageChange = (((totalPenCount - lastPenWeek) / lastPenWeek) * 100).toFixed(2);
      }

      if (pendingPercentageChange > 0) {
        pendingPercentageChange = "+" + pendingPercentageChange + "%";
      } else {
        pendingPercentageChange = pendingPercentageChange + "%";
      }

      res.json({
        todayRequestCount,
        totalRequests,
        percentageChange,
        totalPenCount,
        totalCanCount,
        cancelPercentageChange,
        pendingPercentageChange,
      });
    } catch (error) {
      next(error);
    }
  },

  // In your main graph function
  async graph(req, res, next) {
    try {
      const today = moment().startOf("day");
      const last12MonthsStart = moment(today)
        .subtract(12, "months")
        .startOf("month");
      const last12MonthsEnd = moment(today).endOf("day");
      console.log(last12MonthsStart);

      // Fetch data for the last 12 months
      const last12MonthsData = await getCustomerCountsForMonths(
        req.user._id,
        last12MonthsStart,
        last12MonthsEnd
      );

      res.json({ last12MonthsData });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = rentCarDashController;
