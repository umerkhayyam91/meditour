const vehicleRequest = require("../../models/Rent A Car/vehicleRequest");
const moment = require("moment");

// today request
async function getRequestCountForWeek(vehicleId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const requestCount = await vehicleRequest
      .find({
        createdAt: { $gte: currentDate, $lt: nextDate },
        vehicleId,
      })
      .countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      requestCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

async function getAllMonthsDataForPastYear(vehicleId) {
  const monthsData = [];
  let currentDate = moment().startOf("month").subtract(1, 'month'); // Start from the first day of the month one year ago

  for (let i = 0; i < 12; i++) {
    const startOfMonth = moment(currentDate).startOf("month");
    const endOfMonth = moment(currentDate).endOf("month");

    const ordersCount = await getRequestsCountForMonth(vehicleId, startOfMonth, endOfMonth);

    monthsData.push({
      month: startOfMonth.format("MMMM YYYY"),
      ordersCount,
    });

    currentDate.subtract(1, 'month'); // Move to the previous month
  }

  return monthsData.reverse(); // Reverse the array to have data in chronological order
}

async function getRequestsCountForMonth(vehicleId, startDate, endDate) {
  return await acceptedRequests.countDocuments({
    createdAt: { $gte: startDate, $lt: endDate },
    vehicleId: vehicleId,
  });
}




// async function getRequestsCountsForMonths(vehicleId, startDate, endDate) {
//   const months = [];
//   let currentDate = moment(startDate);

//   while (currentDate.isSameOrBefore(endDate)) {
//     const nextMonth = moment(currentDate).endOf("nextMonth");
//     // Modify this query based on your actual data structure
//     const ordersCount = await vehicleRequest.countDocuments({
//       createdAt: { $gte: currentDate, $lt: nextMonth },
//       vehicleId: vehicleId,
//     });

//     months.push({
//       months: currentDate.format("YYYY-MM-DD"),
//       ordersCount,
//     });

//     currentDate.add(1, "month");
//   }

//   return months;
// }

const rentCarDashController = {
  async dashDetails(req, res, next) {
    try {
      const vehicleId = req.user._id;
      const currentDate = new Date();
      // Set the time to the beginning of the day
      currentDate.setHours(0, 0, 0, 0);
      //.......todayRequestCount......///
      const todayRequestCount = await vehicleRequest
        .find({
          createdAt: { $gte: currentDate, $lt: new Date() },
          vehicleId,
        })
        .countDocuments();
      console.log(todayRequestCount);
      // Fetch data for the last week (including previous 7 days)

      const today = moment().startOf("day");
      const prevWeek = moment(today).subtract(7, "days");

      const prevWeekRequestData = await getRequestCountForWeek(
        req.user._id,
        prevWeek
      );
      let percentageChange;
      if (prevWeek === 0) {
        percentageChange = prevWeekRequestData * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        percentageChange = (
          ((prevWeekRequestData - prevWeek) / prevWeek) *
          100
        ).toFixed(2);
      }

      if (percentageChange > 0) {
        percentageChange = "+" + percentageChange + "%";
      } else {
        percentageChange = percentageChange + "%";
      }

      // Fetch total pending requests a week before
      const lastPenWeek = new Date(currentDate);
      lastPenWeek.setDate(currentDate.getDate() - 7);

      const totalPenCount = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastWeek, $lt: currentDate },
        status: "pending",
      });
      let pendingPercentageChange;
      if (lastPenWeek === 0) {
        pendingPercentageChange = totalPenCount * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        pendingPercentageChange = (
          ((totalPenCount - lastPenWeek) / lastPenWeek) *
          100
        ).toFixed(2);
      }

      if (pendingPercentageChange > 0) {
        pendingPercentageChange = "+" + pendingPercentageChange + "%";
      } else {
        pendingPercentageChange = pendingPercentageChange + "%";
      }
      // fetch total cancelled requests
      const lastCanReq = new Date(currentDate);
      lastCanReq.setDate(currentDate.getDate() - 7);
      const totalCanCount = await vehicleRequest.countDocuments({
        createdAt: { $gte: lastWeek, $lt: currentDate },
        status: "cancelled",
      });
      let cancelPercentageChange;
      if (lastCanReq === 0) {
        cancelPercentageChange = totalCanCount * 100; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        cancelPercentageChange = (
          ((totalCanCount - lastCanReq) / lastCanReq) *
          100
        ).toFixed(2);
      }

      if (cancelPercentageChange > 0) {
        cancelPercentageChange = "+" + cancelPercentageChange + "%";
      } else {
        cancelPercentageChange = cancelPercentageChange + "%";
      }

      res.json({
        todayRequestCount,
        prevWeekRequestData,
        totalPenCount,
        totalCanCount,
        cancelPercentageChange,
        pendingPercentageChange,
        percentageChange,
      });
    } catch (error) {
      next(error);
    }
  },
  // async graph(req, res, next) {
  //   try {
  //     // Calculate date ranges for the last 12 months
  //     const day = moment().startOf("day");
  //     const last12MonthsStart = moment(day)
  //       .subtract(12, "months")
  //       .startOf("day");
  //     const last12MonthsEnd = moment(day).endOf("day");
  //     console.log(last12MonthsStart);

  //     // Fetch data for the last 12 months
  //     const last12MonthsData = await getRequestsCountsForMonths(
  //       req.user._id,
  //       last12MonthsStart,
  //       last12MonthsEnd
  //     );

  //     res.json({ last12MonthsData });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

// In your main graph function
async graph(req, res, next) {
  try {
    // Fetch data for all months of the past year
    const allMonthsData = await getAllMonthsDataForPastYear(req.user._id);

    res.json({ allMonthsData });
  } catch (error) {
    next(error);
  }
}

};
module.exports = rentCarDashController;
