const express = require("express");
const app = express();
const Availability = require("../../models/Doctor/availability")

const docAvailabilityController = {
    async addAvailability(req,res,next){
        try {
            const { doctorId, availability } = req.body;
        
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
                existingDay.startTime = dayAvailability.startTime;
                existingDay.endTime = dayAvailability.endTime;
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
        
    }
}

module.exports = docAvailabilityController;