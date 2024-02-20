
const Appointment = require("../../models/All Doctors Models/appointment");
const { DoctorAvailability } = require("../../models/All Doctors Models/availability");
const Doctors = require("../../models/Doctor/doctors");
const Nutritionist= require("../../models/Nutritionist/nutritionist");
const Paramedic = require("../../models/Paramedic/paramedic");
const Physiotherapist = require("../../models/Physiotherapist/physiotherapist");
const Psychologist = require("../../models/Psychologist/psychologist");
const Rating = require("../../models/rating");

const otherDoctorController={
async getNearByOtherDocs(req,res,next){

  try {
    const latitude = req.query.lat;
    const longitude = req.query.long;
    const name = req.query.name;
    const radius = req.query.radius || 10000;
    const page = req.query.page || 1; // Default to page 1
    const limit = 5;
  const doctorType = req.query.doctorType;

 let doctorQuery = {
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
                doctorQuery.name = regex;
            }

    let doctorModel; // Variable declaration without assignment

    if (doctorType === "doctors") {
      doctorModel = Doctors; // Assign Nutritionist model
    } else if (doctorType === "psychologist") {
      doctorModel = Psychologist; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; 
    }
    else if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; 
    }
    else if (doctorType === "paramedic") {
      doctorModel = Paramedic; 
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch doctors with pagination using the determined model
    let doctorTypes = await doctorModel.find(doctorQuery).skip(skip).limit(limit);

    return res.status(200).json({ doctorTypes, auth: true });
  } catch (error) {
    return next(error);
  }
},
async filterOtherDocs(req, res, next) {
  try {
    const minRating = req.query.minRating;
    const longitude = req.query.long;
    const latitude = req.query.lat;
    const radius = req.query.radius || 1000000;
    const page = req.query.page || 1; // Default to page 1
    const limit = req.query.limit || 10; // Default to 10 labs per page
    const doctorType = req.query.doctorType;
    let doctorModel; // Variable declaration without assignment

    if (doctorType === "doctors") {
      doctorModel = Doctors; // Assign Nutritionist model
    } else if (doctorType === "psychologist") {
      doctorModel = Psychologist; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
    }
    else if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Physiotherapist model
    }
    else if (doctorType === "paramedic") {
      doctorModel = Paramedic; // Assign Physiotherapist model
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }

    

    const doctorsWithinRadius = await doctorModel.find({
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

    const doctorIdsWithinRadius = doctorsWithinRadius.map(
      (doctor) => doctor._id
    );
    console.log(doctorIdsWithinRadius);
    console.log(minRating);

    const doctors = await doctorModel.find({
      _id: { $in: doctorIdsWithinRadius },
      averageRating: { $gte: parseFloat(minRating) },
    })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
},
async getOtherSingleDoc(req, res, next) {
  try {
    const doctorId = req.query.doctorId;
    const doctorType = req.query.doctorType;
    let doctorModel; // Variable declaration without assignment

    if (doctorType === "doctors") {
      doctorModel = Doctors; // Assign Nutritionist model
    } else if (doctorType === "psychologist") {
      doctorModel = Psychologist; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
    }
    else if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Physiotherapist model
    }
    else if (doctorType === "paramedic") {
      doctorModel = Paramedic; // Assign Physiotherapist model
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }


    const otherDoctor = await doctorModel.findById(doctorId );

    if (!otherDoctor) {
      const error = new Error("Doc not found!");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({otherDoctor});
  } catch (error) {
    return next(error);
  }
},

  async getOtherDocsAvailability(req, res, next) {
    try {
      const doctorId = req.query.doctorId;
      const doctorType = req.query.doctorType;
      let doctorModel; // Variable declaration without assignment
      let message;
  
      if (doctorType === "doctors") {
        doctorModel = Doctors; // Assign Nutritionist model
        message = "doctors";
      } 
      else if (doctorType === "psychologist") {
        doctorModel = Psychologist; // Assign Paramedic model
        message = "Psychologist";
      }else if (doctorType === "nutritionist") {
        doctorModel = Nutritionist; // Assign Paramedic model
        message = "Nutritionist";
      }else if (doctorType === "paramedic") {
        doctorModel = Paramedic; // Assign Paramedic model
        message = "Paramedic";
      } else if (doctorType === "physiotherapist") {
        doctorModel = Physiotherapist; // Assign Physiotherapist model
        message = "Physiotherapist";
      } else {
        // Handle invalid doctorType
        return res.status(400).json({ error: "Invalid doctorType provided" });
      }
  
      // Check if doctor availability exists
      const otherDocAvailability = await DoctorAvailability.find({ doctorId })
  
      if (!otherDocAvailability || otherDocAvailability.length === 0) {
        return res.status(404).json({ message: `${message} availability not found` });
      }
  
      res.status(200).json({ availability: otherDocAvailability });
    } catch (error) {
      next(error);
    }
  },
  async addOtherDocAppointment(req, res, next) {
    try {
      const { date, startTime, endTime, appointmentType } = req.body;
      const doctorId = req.query.doctorId;
      const patientId = req.user._id;
      let doctorModel; // Variable declaration without assignment

    if (doctorType === "doctors") {
      doctorModel = Doctors; // Assign Nutritionist model
    } else if (doctorType === "psychologist") {
      doctorModel = Psychologist; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
    }
    else if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Physiotherapist model
    }
    else if (doctorType === "paramedic") {
      doctorModel = Paramedic; // Assign Physiotherapist model
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }
    


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
  
      async addOtherDocRatingReview(req, res, next) {
        try {
          const { rating, review } = req.body;
          const vendorId = req.query.vendorId;
          const userId = req.user._id;
          const doctorType = req.query.doctorType;
          let doctorModel; // Variable declaration without assignment

    if (doctorType === "doctors") {
      doctorModel = Doctors; // Assign Nutritionist model
    } else if (doctorType === "psychologist") {
      doctorModel = Psychologist; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
    }
    else if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Physiotherapist model
    }
    else if (doctorType === "paramedic") {
      doctorModel = Paramedic; 
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }
        
          // Check if the user has already given a review for this vendor
          const existingUserReview = await Rating.findOne({
            vendorId,
            "ratings.userId": userId,
          });
    
          if (existingUserReview) {
            return res
              .status(400)
              .json({ message: "User has already given a review for this vendor" });
          }
    
          // Check if the vendorId exists in the ratings collection
          let existingRating = await Rating.findOne({ vendorId });
    
          // If the vendorId doesn't exist, create a new entry
          if (!existingRating) {
            existingRating = new Rating({
              vendorId,
              ratings: [],
            });
          }
    
          // Add the new rating to the existingRating or the newly created rating
          existingRating.ratings.push({
            userId,
            rating,
            review,
          });
    
          // Save the updated rating to the database
          await existingRating.save();
    
          res.status(201).json({ message: "Review added successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      },
    
      async getAllOtherDocRatingReviews(req, res, next) {
        try {
          const vendorId = req.query.vendorId;
          const doctorType = req.query.doctorType;
          let doctorModel; // Variable declaration without assignment

          if (doctorType === "doctors") {
            doctorModel = Doctors; // Assign Nutritionist model
          } else if (doctorType === "psychologist") {
            doctorModel = Psychologist; // Assign Paramedic model
          } else if (doctorType === "physiotherapist") {
            doctorModel = Physiotherapist; // Assign Physiotherapist model
          }
          else if (doctorType === "nutritionist") {
            doctorModel = Nutritionist; // Assign Physiotherapist model
          }
          else if (doctorType === "paramedic") {
            doctorModel = Paramedic; // Assign Physiotherapist model
          } else {
            // Handle invalid doctorType
            return res.status(400).json({ error: "Invalid doctorType provided" });
          }
        
          let existingRating = await Rating.findOne({ vendorId });
    
          res.status(201).json({ existingRating, auth: true });
        } catch (error) {
          return next(error);
        }
      },
    
}
  
module.exports= otherDoctorController;