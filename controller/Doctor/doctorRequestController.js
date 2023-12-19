const express = require("express");
const app = express();
const Availability = require("../../models/All Doctors Models/availability");

const docRequestController = {
    async requestAppointment(req, res, next) {
        try {
          const { startDateTime, endDateTime, doctorId } = req.body;
    
          // Convert requested start and end dates to moment objects for comparison
          const userStartDateTime = moment(startDateTime);
          const userEndDateTime = moment(endDateTime);
    
          // Check if doctor availability exists
          const doctorAvailability = await Availability.findOne({ doctorId });
    
          if (!doctorAvailability) {
            return res.status(404).json({ message: "Doctor availability not found" });
          }
    
          // Check if the requested start date is in the future
          const currentDate = moment();
          if (userStartDateTime.isBefore(currentDate, "day")) {
            return res.status(400).json({ message: "Requested date is in the past" });
          }
    
          // Check if the requested start and end dates match any available time slots for the given day
          const dayOfWeek = userStartDateTime.day();
          const availablePeriods =
            doctorAvailability.availability.find((day) => day.dayOfWeek === dayOfWeek)
              ?.periods || [];
    
          const areTimeSlotsValid = availablePeriods.some((period) => {
            const startTime = moment(period.startTime, "HH:mm");
            const endTime = moment(period.endTime, "HH:mm");
            return (
              userStartDateTime.isBetween(startTime, endTime, null, "[]") &&
              userEndDateTime.isBetween(startTime, endTime, null, "[]")
            );
          });
    
          if (!areTimeSlotsValid) {
            return res.status(400).json({ message: "Requested time slots are not available" });
          }
    
          // If the requested dates and times are valid, proceed with the appointment request logic
          // ... (Add logic for creating the appointment request)
    
          res.status(200).json({ message: "Appointment request sent successfully" });
        } catch (error) {
          next(error);
        }
      },
};
