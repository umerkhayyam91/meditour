
const Nutritionist= require("../../models/Nutritionist/nutritionist");
const Paramedic = require("../../models/Paramedic/paramedic");
const Physiotherapist = require("../../models/Physiotherapist/physiotherapist");

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

    if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Nutritionist model
    } else if (doctorType === "paramedicStaff") {
      doctorModel = Paramedic; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
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

    if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Nutritionist model
    } else if (doctorType === "paramedic") {
      doctorModel = Paramedic; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
    } else {
      // Handle invalid doctorType
      return res.status(400).json({ error: "Invalid doctorType provided" });
    }c

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

    if (doctorType === "nutritionist") {
      doctorModel = Nutritionist; // Assign Nutritionist model
    } else if (doctorType === "paramedic") {
      doctorModel = Paramedic; // Assign Paramedic model
    } else if (doctorType === "physiotherapist") {
      doctorModel = Physiotherapist; // Assign Physiotherapist model
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
}
module.exports= otherDoctorController;