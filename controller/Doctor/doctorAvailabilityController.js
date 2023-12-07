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
        // Update or add new hospital availability
        let hospitalAvailability =
          doctorAvailability.hospitalAvailabilities.find(
            (hospital) => String(hospital.hospitalId) === String(hospitalId)
          );

        if (!hospitalAvailability) {
          // Create a new Mongoose model for hospitalAvailability
          hospitalAvailability = new HospitalAvailability({
            hospitalId: hospitalId,
            availability: [],
          });
          console.log(hospitalAvailability);
          // Add the new hospitalAvailability to the hospitalAvailabilities array
          // doctorAvailability.hospitalAvailabilities.push(hospitalAvailability);
          // console.log(doctorAvailability);
        }

        // Initialize hospitalAvailability.availability as an empty array if it's undefined or null
        hospitalAvailability.availability =
          hospitalAvailability.availability || [];
        console.log(hospitalAvailability.availability);
        // console.log(hospitalAvailability)
        // Update or add new availability for each day
        availability.forEach((dayAvailability) => {
          const existingDay = hospitalAvailability.availability.find(
            (day) => day.dayOfWeek === dayAvailability.dayOfWeek
          );

          console.log("object");

          if (existingDay) {
            // Update existing day's availability
            existingDay.periods = dayAvailability.periods;
          } else {
            // Add new day's availability
            // console.log("dayAvailability", dayAvailability)
            // hospitalAvailability.availability.push(dayAvailability);
            // console.log("hospitalAvailability.availability", hospitalAvailability.availability)

            console.log("dayAvailability", dayAvailability);
            // Add new day's availability
            hospitalAvailability.availability.push(dayAvailability);
            console.log("hospitalAvailability.availability", hospitalAvailability.availability);
            doctorAvailability.hospitalAvailabilities.push(dayAvailability);
            console.log("doctorAvailability", doctorAvailability);
          }
        });
        // });
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
