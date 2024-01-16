const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const pharmOrder = require("../../models/Pharmacy/pharmOrder.js");
const orderDto = require("../../dto/pharmOrder.js");
const moment = require("moment");
const Tests = require("../../models/Laboratory/tests.js");
const Pharmacy = require("../../models/Pharmacy/pharmacy.js");

async function getOrderCountsForWeek(labId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const ordersCount = await pharmOrder
      .find({
        createdAt: { $gte: currentDate, $lt: nextDate },
        labId: labId,
      })
      .countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      ordersCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

const pharmOrderController = {
  async getOrders(req, res) {
    try {
      // const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      // const usersPerPage = 10;
      // const totalUsers = await User.countDocuments(); // Get the total number of posts for the user
      // const totalPages = Math.ceil(totalUsers / usersPerPage); // Calculate the total number of pages

      // const skip = (page - 1) * usersPerPage; // Calculate the number of posts to skip based on the current page

      // // Fetch the posts for the specified page
      // const users = await User.find().skip(skip).limit(usersPerPage);

      // let previousPage = page > 1 ? page - 1 : null;
      // let nextPage = page < totalPages ? page + 1 : null;

      // res.json({
      //     status: true,
      //     message: "Below are all the users",
      //     users: users,
      //     previousPage: previousPage,
      //     nextPage: nextPage
      // });

      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const pharmPerPage = 10;
      const pharmId = req.user._id;
      const totalPharms = await pharmOrder.countDocuments({ pharmId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalPharms / pharmPerPage); // Calculate the total number of pages

      const skip = (page - 1) * pharmPerPage; // Calculate the number of posts to skip based on the current page

      const allOrders = await pharmOrder
        .find({ pharmId })
        .skip(skip)
        .limit(pharmPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const OrderDto = new orderDto(allOrders);
      return res
        .status(200)
        .json({
          orders: allOrders,
          auth: true,
          previousPage: previousPage,
          nextPage: nextPage,
        }); 
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async changeStatus(req, res, next) {
    try {
      const newStatus = req.body.status;
      if (!newStatus) {
        const error = {
          status: 401,
          message: "Status not found",
        };

        return next(error);
      }
      const id = req.query.id;
      const result = await Pharmacy.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { status: newStatus } },
        { returnDocument: "after" } // Optional: Specify 'after' to return the updated document
      );
      if (!result) {
        const error = {
          status: 401,
          message: "Order not found",
        };

        return next(error);
      }
      res.status(200).json({
        auth: true,
        message: "status changed successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async dashDetails(req, res, next) {
    try {
      // Get the current date
      const currentDate = new Date();

      // Set the time to the beginning of the day
      currentDate.setHours(0, 0, 0, 0);

      // Calculate yesterday's date
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);

      // Set the time to the beginning of yesterday
      yesterdayDate.setHours(0, 0, 0, 0);

      const dayBeforeYesterday = new Date(currentDate);
      dayBeforeYesterday.setDate(currentDate.getDate() - 2);

      // Set the time to the beginning of the day before yesterday
      dayBeforeYesterday.setHours(0, 0, 0, 0);

      // Fetch the count of orders for the day before yesterday
      const penDayBefYesCount = await pharmOrder.countDocuments({
        createdAt: { $gte: dayBeforeYesterday, $lt: yesterdayDate },
        status: "pending",
      });
      // Fetch the count of orders for yesterday
      const yesterdayOrdersCount = await pharmOrder.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
      });

      const pendingYesOrdersCount = await pharmOrder.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        status: "pending",
      });

      // Fetch the count of orders for today
      const todayOrdersCount = await pharmOrder.countDocuments({
        createdAt: { $gte: currentDate, $lt: new Date() },
      });

      const completeTodayOrdersCount = await pharmOrder.countDocuments({
        createdAt: { $gte: currentDate, $lt: new Date() },
        status: "completed",
      });

      const completeYesOrdersCount = await pharmOrder.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        status: "completed",
      });

      let pendingPercentageChange;
      if (penDayBefYesCount === 0) {
        pendingPercentageChange = pendingYesOrdersCount * 100 + "%"; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        pendingPercentageChange =
          (
            ((pendingYesOrdersCount - penDayBefYesCount) / penDayBefYesCount) *
            100
          ).toFixed(2) + "%";
      }

      // Handle the case where yesterday's orders are zero
      let newOrdersPercentageChange;
      if (yesterdayOrdersCount === 0) {
        newOrdersPercentageChange = todayOrdersCount * 100 + "%"; // If yesterday's orders are zero, the change is undefined
      } else {
        newOrdersPercentageChange =
          (
            ((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) *
            100
          ).toFixed(2) + "%";
      }

      let comOrdersPercentageChange;
      if (completeYesOrdersCount === 0) {
        comOrdersPercentageChange = completeTodayOrdersCount * 100 + "%"; // If yesterday's orders are zero, the change is undefined
      } else {
        comOrdersPercentageChange =
          (
            ((completeTodayOrdersCount - completeYesOrdersCount) /
              completeYesOrdersCount) *
            100
          ).toFixed(2) + "%";
      }

      res.json({
        todayOrdersCount,
        newOrdersPercentageChange,
        pendingYesOrdersCount,
        pendingPercentageChange,
        completeTodayOrdersCount,
        comOrdersPercentageChange,
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
      const currentWeekData = await getOrderCountsForWeek(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );

      // Fetch data for the previous week
      const previousWeekData = await getOrderCountsForWeek(
        req.user._id,
        previousWeekStart,
        previousWeekEnd
      );

      res.json({ currentWeekData, previousWeekData });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = pharmOrderController;
