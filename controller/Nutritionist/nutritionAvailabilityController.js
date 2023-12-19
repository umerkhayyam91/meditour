const express = require("express");
const app = express();
const {
  DoctorAvailability,
  HospitalAvailability,
} = require("../../models/All Doctors Models/availability");

const docAvailabilityController = {
  async addAvailability(req, res, next) {
    try {
      const { availability, hospitalId, availabilityType } = req.body;
      const doctorId = req.user._id;

      // Check if doctor availability already exists
      let doctorAvailability = await DoctorAvailability.findOne({ doctorId });

      // If availability document doesn't exist, create a new one
      if (!doctorAvailability) {
        doctorAvailability = new DoctorAvailability({
          doctorId,
          hospitalAvailabilities: [],
          clinicAvailability: { availability: [] },
          inHouseAvailability: { availability: [] },
        });
      }

      // Check if the availability is for the clinic or a specific hospital
      if (hospitalId && availabilityType == "hospital") {
        // Find or create hospitalAvailability
        let hospitalAvailability =
          doctorAvailability.hospitalAvailabilities.find(
            (hospital) => String(hospital.hospitalId) === String(hospitalId)
          );

        if (!hospitalAvailability) {
          hospitalAvailability = {
            hospitalId: hospitalId,
            availability: [],
          };
          doctorAvailability.hospitalAvailabilities.push(hospitalAvailability);
          await doctorAvailability.save();
          hospitalAvailability = doctorAvailability.hospitalAvailabilities.find(
            (hospital) => String(hospital.hospitalId) === String(hospitalId)
          );
        }

        hospitalAvailability.availability =
          hospitalAvailability.availability || [];

        availability.forEach((dayAvailability) => {
          const existingDay = hospitalAvailability.availability.find(
            (day) => day.dayOfWeek === dayAvailability.dayOfWeek
          );

          if (existingDay) {
            existingDay.periods = dayAvailability.periods;
          } else {
            const newAvailability = { ...dayAvailability }; // Create a copy
            hospitalAvailability.availability.push(newAvailability);
          }
        });

        await doctorAvailability.save();
      } else if (availabilityType == "clinic") {
        // Update or add new clinic availability for each day
        availability.forEach((dayAvailability) => {
          const existingDay =
            doctorAvailability.clinicAvailability.availability.find(
              (day) => day.dayOfWeek === dayAvailability.dayOfWeek
            );

          if (existingDay) {
            // Update existing day's availability
            existingDay.periods = dayAvailability.periods;
          } else {
            // Add new day's availability
            doctorAvailability.clinicAvailability.availability.push(
              dayAvailability
            );
          }
        });
      } else if (availabilityType == "inHouse") {
        availability.forEach((dayAvailability) => {
          const existingDay =
            doctorAvailability.inHouseAvailability.availability.find(
              (day) => day.dayOfWeek === dayAvailability.dayOfWeek
            );

          if (existingDay) {
            // Update existing day's availability
            existingDay.periods = dayAvailability.periods;
          } else {
            // Add new day's availability
            doctorAvailability.inHouseAvailability.availability.push(
              dayAvailability
            );
          }
        });
      }

      // Save the updated availability
      await doctorAvailability.save();

      res
        .status(200)
        .json({ message: "Doctor availability updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  async getAvailability(req, res, next) {
    try {
      const doctorId = req.user._id;
      console.log(doctorId);
      // Check if doctor availability exists
      const doctorAvailability = await DoctorAvailability.findOne({ doctorId });

      if (!doctorAvailability) {
        return res
          .status(404)
          .json({ message: "Doctor availability not found" });
      }

      res.status(200).json({ availability: doctorAvailability });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = docAvailabilityController;
