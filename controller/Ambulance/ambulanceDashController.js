const OnRoute = require("../../models/Ambulance/onRoute.js");
const BookingRequest = require("../../models/Ambulance/bookingRequest.js");
const moment = require("moment");

// async function getOrderCountsForWeek(labId, startDate, endDate) {
//   const days = [];
//   let currentDate = moment(startDate);

//   while (currentDate.isSameOrBefore(endDate)) {
//     const nextDate = moment(currentDate).endOf("day");
//     // Modify this query based on your actual data structure
//     const ordersCount = await Order.find({
//       createdAt: { $gte: currentDate, $lt: nextDate },
//       labId: labId,
//     }).countDocuments();

//     days.push({
//       date: currentDate.format("YYYY-MM-DD"),
//       ordersCount,
//     });

//     currentDate.add(1, "days");
//   }

//   return days;
// }

async function getRequestCountForWeek(ambulanceId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const requestCount = await BookingRequest.find({
      createdAt: { $gte: currentDate, $lt: nextDate },
      ambulanceId,
    }).countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      requestCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

async function getOnRouteCountForWeek(ambulanceId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const onRouteCount = await OnRoute.find({
      createdAt: { $gte: currentDate, $lt: nextDate },
      ambulanceId,
    }).countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      onRouteCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

async function getOrderCountsForMonths(ambulanceId, startDate, endDate) {
  const months = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextMonth = moment(currentDate).endOf("month");
    // Modify this query based on your actual data structure
    const distinctCustomerIds = await OnRoute.distinct("customerId", {
      createdAt: { $gte: currentDate, $lt: nextMonth },
      ambulanceId: ambulanceId,
    });

    const ordersCount = distinctCustomerIds.length;

    months.push({
      month: currentDate.format("YYYY-MM"),
      ordersCount,
    });

    currentDate.add(1, "months");
  }

  return months;
}

const ambulanceDashController = {
  async dashDetails(req, res, next) {
    try {
      const ambulanceId = req.user._id;
      const currentDate = new Date();
      // Set the time to the beginning of the day
      currentDate.setHours(0, 0, 0, 0);

      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);

      yesterdayDate.setHours(0, 0, 0, 0);

      //.......todayRequestCount......///
      const todayRequestCount = await BookingRequest.find({
        createdAt: { $gte: currentDate, $lt: new Date() },
        ambulanceId,
      }).countDocuments();
      console.log(todayRequestCount);

      const yesterdayRequestCount = await BookingRequest.find({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        ambulanceId,
      }).countDocuments();

      //.........requestPercentageChange............//
      let requestPercentageChange;
      if (yesterdayRequestCount === 0) {
        requestPercentageChange = todayRequestCount * 100;
      } else {
        requestPercentageChange = (
          ((todayRequestCount - yesterdayRequestCount) /
            yesterdayRequestCount) *
          100
        ).toFixed(2);
      }

      if (requestPercentageChange > 0) {
        requestPercentageChange = "+" + requestPercentageChange + "%";
      } else {
        requestPercentageChange = requestPercentageChange + "%";
      }

      const today = moment().startOf("day");
      const currentWeekStart = moment(today).subtract(7, "days").startOf("day");
      const currentWeekEnd = moment(today).endOf("day");
      const previousWeekStart = moment(currentWeekStart).subtract(7, "days");
      const previousWeekEnd = moment(currentWeekStart).subtract(1, "days");

      // Fetch data for the current week (including previous 7 days)
      const currentWeekRequestData = await getRequestCountForWeek(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );

      // Fetch data for the previous week
      const previousWeekRequestData = await getRequestCountForWeek(
        req.user._id,
        previousWeekStart,
        previousWeekEnd
      );

      




        //..............todayOnRouteCount..............//
      const todayOnRouteCount = await OnRoute.find({
        createdAt: { $gte: currentDate, $lt: new Date() },
        ambulanceId,
      }).countDocuments();
      console.log(todayOnRouteCount);

      const yesterdayOnRouteCount = await OnRoute.find({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        ambulanceId,
      }).countDocuments();

      //.........onRoutePercentageChange............//
      let onRoutePercentageChange;
      if (yesterdayOnRouteCount === 0) {
        onRoutePercentageChange = todayOnRouteCount * 100;
      } else {
        onRoutePercentageChange = (
          ((todayOnRouteCount - yesterdayOnRouteCount) /
            yesterdayOnRouteCount) *
          100
        ).toFixed(2);
      }

      if (onRoutePercentageChange > 0) {
        onRoutePercentageChange = "+" + onRoutePercentageChange + "%";
      } else {
        onRoutePercentageChange = onRoutePercentageChange + "%";
      }

      const currentWeekOnRouteData = await getOnRouteCountForWeek(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );

      // Fetch data for the previous week
      const previousWeekOnRouteData = await getOnRouteCountForWeek(
        req.user._id,
        previousWeekStart,
        previousWeekEnd
      );

      res.json({
        todayRequestCount,
        requestPercentageChange,
        currentWeekRequestData,
        previousWeekRequestData,
        todayOnRouteCount,
        onRoutePercentageChange,
        currentWeekOnRouteData,
        previousWeekOnRouteData
      });
    } catch (error) {
      next(error);
    }
  },

  // async graph(req, res, next) {
  //   try {
  //     // Calculate date ranges for the current week (including previous 7 days) and previous week
  //     const today = moment().startOf("day");
  //     const currentWeekStart = moment(today).subtract(7, "days").startOf("day");
  //     const currentWeekEnd = moment(today).endOf("day");
  //     const previousWeekStart = moment(currentWeekStart).subtract(7, "days");
  //     const previousWeekEnd = moment(currentWeekStart).subtract(1, "days");

  //     // Fetch data for the current week (including previous 7 days)
  //     const currentWeekData = await getOrderCountsForWeek(
  //       req.user._id,
  //       currentWeekStart,
  //       currentWeekEnd
  //     );

  //     // Fetch data for the previous week
  //     const previousWeekData = await getOrderCountsForWeek(
  //       req.user._id,
  //       previousWeekStart,
  //       previousWeekEnd
  //     );

  //     res.json({ currentWeekData, previousWeekData });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  async graph(req, res, next) {
    try {
      // Calculate date ranges for the last 12 months
      const today = moment().startOf("day");
      const last12MonthsStart = moment(today)
        .subtract(12, "months")
        .startOf("month");
      const last12MonthsEnd = moment(today).endOf("day");
      console.log(last12MonthsStart);

      // Fetch data for the last 12 months
      const last12MonthsData = await getOrderCountsForMonths(
        req.user._id,
        last12MonthsStart,
        last12MonthsEnd
      );

      res.json({ last12MonthsData });
    } catch (error) {
      next(error);
    }
  },

  async addBooking(req, res, next) {
    try {
      const { phoneNo, address, dateAndTime, description } = req.body;
      const ambulanceId = req.user._id;

      // Create a new appointment
      const newRequest = new BookingRequest({
        ambulanceId,
        customerId: "656d8f881561be3e8854ade6",
        phoneNo,
        address,
        dateAndTime,
        description,
      });

      // Save the new appointment to the database
      const savedBooking = await newRequest.save();

      res.status(201).json({
        appointment: savedBooking,
        message: "Booking added successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ambulanceDashController;
