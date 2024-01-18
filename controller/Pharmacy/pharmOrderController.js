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



   async testing(req, res, next) {
    try {
      const { orderId, customerName, MR_NO, date, status, totalAmount } =
      req.body;
    const pharmId = req.user._id;

    let test;

    let medCode = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999

      const testToRegister = new pharmOrder({
        pharmId,
        medCode,
        orderId,
        customerName,
        MR_NO,
        date,
        status,
        totalAmount,
      });

      test = await testToRegister.save();
      res.json("order added successfully!")
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = pharmOrderController;
