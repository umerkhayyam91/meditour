const express = require("express");
const app = express();
const Request = require("../../models/Ambulance/bookingRequest");
const OnRoute = require("../../models/Ambulance/onRoute");

const ambulanceRequestController = {
  async getRequests(req, res, next) {
    try {
      const ambulanceId = req.user._id;
      const requests = await Request.find({ ambulanceId , status: "pending"});
      if (requests.length == 0) {
        const error = new Error("No Requests found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ requests });
    } catch (error) {
      return next(error);
    }
  },

  async acceptRequest(req, res, next) {
    try {
      const bookingId = req.query.bookingId;
      const booking = await Request.findById(bookingId);
      if (!booking) {
        const error = new Error("Booking request not found!");
        error.status = 404;
        return next(error);
      }
      booking.status = "accept";
      await booking.save();
      const onRoute = new OnRoute({
        ambulanceId: booking.ambulanceId,
        customerId: booking.customerId,
        dateAndTime: Date.now(),
        vehicleNo: req.body.vehicleNo,
      });
      await onRoute.save();
      return res.status(200).json({
        auth: true,
        message: "Booking Accepted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async rejectRequest(req, res, next) {
    try {
      const bookingId = req.query.bookingId;
      const booking = await Request.findById(bookingId);
      if (!booking) {
        const error = new Error("Booking request not found!");
        error.status = 404;
        return next(error);
      }
      await Request.findByIdAndDelete(bookingId);
      return res.status(200).json({
        auth: true,
        message: "Booking rejected successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async getOnRoutes(req, res, next) {
    try {
      const ambulanceId = req.user._id;
      const allRoutes = await OnRoute.find({ ambulanceId });
      if (!allRoutes) {
        const error = new Error("Routes not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({
        message: "Routes fetched successfully",
        routes: allRoutes,
      });
    } catch (error) {
      return next(error);
    }
  },

  async addRoute(req, res, next) {
    const ambulanceId = req.user._id;
    const customerId = req.query.customerId;
    const vehicleNo = req.body.vehicleNo;

    let route;

    try {
      const routeToRegister = new OnRoute({
        ambulanceId,
        customerId,
        vehicleNo,
      });

      route = await routeToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    return res.status(201).json({ Route: route, auth: true });
  },

  async bookRequest(req, res, next) {
    const ambulanceId = req.user._id;
    const customerId = req.query.customerId;
    const { phoneNo, address, description } = req.body;

    let request;

    try {
      const requestToRegister = new Request({
        ambulanceId,
        customerId,
        phoneNo,
        address,
        description,
      });

      request = await requestToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    return res.status(201).json({ Request: request, auth: true });
  },
};

module.exports = ambulanceRequestController;
