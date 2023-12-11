const express = require("express");
const app = express();
const {
  DoctorAvailability,
  HospitalAvailability,
} = require("../../models/Doctor/availability");

const docAvailabilityController = {
  async addAvailability(req, res, next) {
    try {
      const { availability, hospitalId } = req.body;
      const doctorId = req.user._id;

      // Check if doctor availability already exists
      let doctorAvailability = await DoctorAvailability.findOne({ doctorId });

      // If availability document doesn't exist, create a new one
      if (!doctorAvailability) {
        doctorAvailability = new DoctorAvailability({
          doctorId,
          hospitalAvailabilities: [],
          clinicAvailability: { availability: [] },
        });
      }

      // Check if the availability is for the clinic or a specific hospital
      if (hospitalId) {
        // Find or create hospitalAvailability
        let hospitalAvailability =
          doctorAvailability.hospitalAvailabilities.find(
            (hospital) => String(hospital.hospitalId) === String(hospitalId)
          );

        if (!hospitalAvailability) {
          hospitalAvailability = new HospitalAvailability({
            hospitalId: hospitalId,
            availability: [],
          });
          doctorAvailability.hospitalAvailabilities.push(hospitalAvailability);
        }
        // console.log("hospitalAvailability before update:", hospitalAvailability);

        // Ensure hospitalAvailability.availability is initialized
        hospitalAvailability.availability =
          hospitalAvailability.availability || [];

        // Update or add new availability for each day
        console.log("doctorAvailability before loop:", doctorAvailability);
        availability.forEach((dayAvailability) => {
          // console.log("hospitalAvailability before iteration:", hospitalAvailability);

          const existingDay = hospitalAvailability.availability.find(
            (day) => day.dayOfWeek === dayAvailability.dayOfWeek
          );

          // console.log("Adding new day's availability:", dayAvailability);

          if (existingDay) {
            // Update existing day's availability
            // console.log("Updating existing day's availability:", existingDay);
            existingDay.periods = dayAvailability.periods;
          } else {
            // Add new day's availability
            // console.log("Adding new day's availability:", dayAvailability);
            const newAvailability = { ...dayAvailability }; // Create a copy
            hospitalAvailability.availability.push(newAvailability);
            // console.log("hospitalAvailability after push:", hospitalAvailability);
          }
        });

        console.log("doctorAvailability after loop:", doctorAvailability);
        await doctorAvailability.save();
        console.log(
          "doctorAvailability saved to the database:",
          doctorAvailability
        );
      } else {
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

      res.status(200).json({ availability: doctorAvailability.availability });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = docAvailabilityController;
