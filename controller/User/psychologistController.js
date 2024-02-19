const Psychologist = require("../../models/Psychologist/psychologist");
const { DoctorAvailability } = require('../../models/All Doctors Models/availability');
const Appointment = require("../../models/All Doctors Models/appointment");
const Rating = require("../../models/rating")

const psychologistController = {

    async getNearbyPsychologists(req, res, next) {

        try {
            const latitude = req.query.lat;
            const longitude = req.query.long;
            const radius = req.query.radius || 10000;
            const name = req.query.name;
            const page = req.query.page || 1;
            const limit = 5;

            let psychologistQuery = {
                loc: {
                    $near: {
                        $geometry: {

                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: radius,
                    },
                },
            };
            if (name) {
                const regex = new RegExp(name, "i");
                psychologistQuery.name = regex;
            }
            //skip
            const skip = (page - 1) * limit;
            let psychologists = await Psychologist.find(psychologistQuery).skip(skip).limit(limit);
            return res.status(200).json({ psychologists, auth: true });
        } catch (error) {
            return next(error);
        }
    },
    async filterPsychologist(req, res, next) {
        try {
          const minRating = req.query.minRating;
          const longitude = req.query.long;
          const latitude = req.query.lat;
          const radius = req.query.radius || 1000000;
          const page = req.query.page || 1; // Default to page 1
          const limit = req.query.limit || 10; // Default to 10 labs per page
    
          const psychologistsWithinRadius = await Psychologist.find({
            loc: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                $maxDistance: radius,
              },
            },
          });
          const psychologistIdsWithinRadius = psychologistsWithinRadius.map(
            (doctor) => doctor._id
          );
        //   console.log(psychologistIdsWithinRadius);
        //   console.log(minRating);
    
          const Psychologists = await Psychologist.find({
            _id: { $in: psychologistIdsWithinRadius },
            averageRating: { $gte: parseFloat(minRating) },
          })
            .skip((page - 1) * limit)
            .limit(limit);
    
          return res.status(200).json({ Psychologists});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }
      },

      async getPsychologist(req, res, next) {
        try {
          const psychologistId = req.query.psychologistId;
    
          const psychologist = await Psychologist.findById(psychologistId );
    
          if (!psychologist) {
            const error = new Error("Psychologist not found!");
            error.status = 404;
            return next(error);
          }
    
          return res.status(200).json({psychologist});
        } catch (error) {
          return next(error);
        }
      },
    
      async getPsychoAvailability(req, res, next) {
        try {
        const doctorId = req.query.doctorId;
          // Check if doctor availability exists
          const psychoAvailability = await DoctorAvailability.find({doctorId})
    
          if (!psychoAvailability) {
            return res
              .status(404)
              .json({ message: "Psychologist availability not found" });
          }
    
          res.status(200).json({ availability: psychoAvailability });
        } catch (error) {
          next(error);
        }
      },
    
      async addPsyAppointment(req, res, next) {
        try {
          const { date, startTime, endTime, appointmentType } = req.body;
          const doctorId = req.query.doctorId;
          const patientId = req.user._id;
    
          // Create a new appointment
          const newAppointment = new Appointment({
            doctorId,
            patientId,
            date,
            startTime,
            endTime,
            appointmentType
          });
    
          // Save the new appointment to the database
          const savedAppointment = await newAppointment.save();
    
          res
            .status(201)
            .json({
              appointment: savedAppointment,
              message: "Appointment added successfully",
            });
        } catch (error) {
          next(error);
        }
      },
      
 
      // async addRatingReview(req, res, next) {
      //   try {
      //     const { rating, review } = req.body;
      //     const vendorId = req.query.vendorId;
      //     const userId = req.user._id;
    
      //     // Check if the user has already given a review for this vendor
      //     const existingUserReview = await Rating.findOne({
      //       vendorId,
      //       "ratings.userId": userId,
      //     });
    
      //     if (existingUserReview) {
      //       return res
      //         .status(400)
      //         .json({ message: "User has already given a review for this vendor" });
      //     }
    
      //     // Check if the vendorId exists in the ratings collection
      //     let existingRating = await Rating.findOne({ vendorId });
    
      //     // If the vendorId doesn't exist, create a new entry
      //     if (!existingRating) {
      //       existingRating = new Rating({
      //         vendorId,
      //         ratings: [],
      //       });
      //     }
    
      //     // Add the new rating to the existingRating or the newly created rating
      //     existingRating.ratings.push({
      //       userId,
      //       rating,
      //       review,
      //     });
    
      //     // Save the updated rating to the database
      //     await existingRating.save();
    
      //     res.status(201).json({ message: "Review added successfully" });
      //   } catch (error) {
      //     console.error(error);
      //     res.status(500).json({ message: "Internal Server Error" });
      //   }
      // },
    
      // async getAllRatingReviews(req, res, next) {
      //   try {
      //     const vendorId = req.query.vendorId;
      //     let existingRating = await Rating.findOne({ vendorId });
    
      //     res.status(201).json({ existingRating, auth: true });
      //   } catch (error) {
      //     return next(error);
      //   }
      // },
    };
module.exports = psychologistController;