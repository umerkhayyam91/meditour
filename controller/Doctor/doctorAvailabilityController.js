const express = require("express");
const app = express();
const Availability = require("../../models/Doctor/availability");

const docAvailabilityController = {
  async addAvailability(req, res, next) {
    try {
        console.log("object")
      const { availability } = req.body;
      const doctorId = req.user._id;

      // Check if doctor availability already exists
      let doctorAvailability = await Availability.findOne({ doctorId });

      // If availability document doesn't exist, create a new one
      if (!doctorAvailability) {
        doctorAvailability = new Availability({ doctorId, availability: [] });
      }

      // Update or add new availability for each day
      availability.forEach(dayAvailability => {
        const existingDay = doctorAvailability.availability.find(day => day.dayOfWeek === dayAvailability.dayOfWeek);

        if (existingDay) {
          // Update existing day's availability
          existingDay.periods = dayAvailability.periods;
        } else {
          // Add new day's availability
          doctorAvailability.availability.push(dayAvailability);
        }
      });

      // Save the updated availability
      await doctorAvailability.save();

      res.status(200).json({ message: 'Doctor availability updated successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getAvailability(req, res, next) {
    try {
      const doctorId = req.user._id;

      // Check if doctor availability exists
      const doctorAvailability = await Availability.findOne({ doctorId });

      if (!doctorAvailability) {
        return res.status(404).json({ message: 'Doctor availability not found' });
      }

      res.status(200).json({ availability: doctorAvailability.availability });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = docAvailabilityController;
