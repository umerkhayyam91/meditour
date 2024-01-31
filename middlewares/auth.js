const JWTService = require("../services/JWTService");
const User = require("../models/user");
const labDto = require("../dto/lab");
const pharmDto = require("../dto/pharm");
const docDto = require("../dto/doctor");
const hospDto = require("../dto/hospital");
const ambulanceDto = require("../dto/ambulanceCompany");
const physioDto = require("../dto/physio");
const nutritionistDto = require("../dto/nutritionist");
const paramedicDto = require("../dto/nutritionist");
const psychologistDto = require("../dto/psychologist");
const agencyDto = require("../dto/travelAgency");
const rentCarDTO = require("../dto/rentCar");
const donationDTO = require("../dto/donation");
const hotelDTO = require("../dto/hotel");
const insuranceDTO = require("../dto/insurance");
const Laboratory = require("../models/Laboratory/laboratory");
const AmbulanceCompany = require("../models/Ambulance/ambulanceCompany");
const Pharmacy = require("../models/Pharmacy/pharmacy");
const Doctor = require("../models/Doctor/doctors");
const Hospital = require("../models/Hospital/hospital");
const Physiotherapist = require("../models/Physiotherapist/physiotherapist");
const Nutritionist = require("../models/Nutritionist/nutritionist");
const Paramedic = require("../models/Paramedic/paramedic");
const Psychologist = require("../models/Psychologist/psychologist");
const Agency = require("../models/Travel Agency/travelAgency");
const RentCar = require("../models/Rent A Car/rentCar");
const Donation = require("../models/Donation/donation");
const Hotel = require("../models/Hotel/hotel");
const Insurance = require("../models/Insurance/insurance");
const AccessToken = require("../models/accessToken");

const auth = async (req, res, next) => {
  try {
    // 1. refresh, access token validation
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const ifTokenExists = await AccessToken.find({ token: accessToken });
    if (ifTokenExists == "") {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }

    if (!accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }
    let _id;

    try {
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }
    let user;
    if (req.originalUrl.includes("/lab")) {
      try {
        user = await Laboratory.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const LabDto = new labDto(user);

      req.user = LabDto;

      next();
      return;
    } else if (req.originalUrl.includes("/pharm")) {
      try {
        user = await Pharmacy.findOne({ _id: _id });
        console.log(user);
      } catch (error) {
        return next(error);
      }
      const PharmDto = new pharmDto(user);

      req.user = PharmDto;
      next();
      return;
    } else if (req.originalUrl.includes("/doc")) {
      try {
        user = await Doctor.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const docDTO = new docDto(user);

      req.user = docDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/hosp")) {
      try {
        user = await Hospital.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const hospDTO = new hospDto(user);

      req.user = hospDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/ambulance")) {
      try {
        console.log(_id);
        user = await AmbulanceCompany.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      console.log(user);
      const ambulanceDTO = new ambulanceDto(user);

      req.user = ambulanceDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/physio")) {
      try {
        user = await Physiotherapist.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const physioDTO = new physioDto(user);

      req.user = physioDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/nutritionist")) {
      try {
        user = await Nutritionist.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const nutritionistDTO = new nutritionistDto(user);

      req.user = nutritionistDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/paramedic")) {
      try {
        user = await Paramedic.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const paramedicDTO = new paramedicDto(user);

      req.user = paramedicDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/psychologist")) {
      try {
        user = await Psychologist.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const psychologistDTO = new psychologistDto(user);

      req.user = psychologistDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/agency")) {
      try {
        user = await Agency.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const agencyDTO = new agencyDto(user);

      req.user = agencyDTO;

      next();
      return;
    } else if (req.originalUrl.includes("/rentCar")) {
      try {
        user = await RentCar.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const rentCarDto = new rentCarDTO(user);

      req.user = rentCarDto;

      next();
      return;
    } else if (req.originalUrl.includes("/donation")) {
      try {
        user = await Donation.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const donationDto = new donationDTO(user);

      req.user = donationDto;

      next();
      return;
    } else if (req.originalUrl.includes("/hotel")) {
      try {
        user = await Hotel.findOne({_id: _id });
      } catch (error) {
        return next(error);
      }
      const hotelDto = new hotelDTO(user);

      req.user = hotelDto;

      next();
      return;

    }else if (req.originalUrl.includes("/insurance")) {
      try {
        user = await Insurance.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const insuranceDto = new insuranceDTO(user);

      req.user = insuranceDto;

      next();
      return;
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
