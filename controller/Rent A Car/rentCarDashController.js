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
      const todayRequestCount = await vehicleRequest.countDocuments({
        createdAt: { $gte: currentDate, $lt: new Date() },
        rentACarId,
      });

      //  ............total requests last week.........//

      const lastWeek = new Date(currentDate);
      lastWeek.setDate(currentDate.getDate() - 7);
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(currentDate.getDate() - 14);

      const thisWeekRequests = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastWeek, $lt: currentDate },
        rentACarId,
      });
      const lastWeekRequests = await vehicleRequest.countDocuments({
        createdAt: { $gte: prevWeek, $lte: lastWeek },
        rentACarId,
      });

      let requestPercentageChange;
      if (lastWeekRequests == 0) {
        requestPercentageChange = thisWeekRequests * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        requestPercentageChange = (
          ((thisWeekRequests - lastWeekRequests) / lastWeekRequests) *
          100
        ).toFixed(2);
      }

      if (requestPercentageChange > 0) {
        requestPercentageChange = "+" + requestPercentageChange + "%";
      } else {
        requestPercentageChange = requestPercentageChange + "%";
      }

      //  ............total pending requests last week.........//
      const totalPenRequests = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastWeek, $lt: currentDate },
        status: "pending",
        rentACarId,
      });
      console.log(totalPenRequests);
      const lastWeekPenRequests = await vehicleRequest.countDocuments({
        createdAt: { $gte: prevWeek, $lte: lastWeek },
        status: "pending",
        rentACarId,
      });
      console.log(lastWeekPenRequests);
      let requestPenPercentage;
      if (lastWeekPenRequests == 0) {
        requestPenPercentage = totalPenRequests * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        requestPenPercentage = (
          ((totalPenRequests - lastWeekPenRequests) / lastWeekPenRequests) *
          100
        ).toFixed(2);
      }

      if (requestPenPercentage > 0) {
        requestPenPercentage = "+" + requestPenPercentage + "%";
      } else {
        requestPenPercentage = requestPenPercentage + "%";
      }

      res.json({
        todayRequestCount: todayRequestCount,
        requestPercentageChange: requestPercentageChange,
        requestPenPercentage: requestPenPercentage,
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
