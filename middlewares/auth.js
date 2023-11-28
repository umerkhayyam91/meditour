const JWTService = require("../services/JWTService");
const User = require("../models/user");
const labDto = require("../dto/lab");
const pharmDto = require("../dto/pharm");
const Laboratory = require("../models/Laboratory/laboratory");
const Pharmacy = require("../models/Pharmacy/pharmacy");

const auth = async (req, res, next) => {
  try {
    // 1. refresh, access token validation
    const { refreshToken, accessToken } = req.cookies;
    if (!refreshToken || !accessToken) {
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
    }else if (req.originalUrl.includes("/pharm")) {
      try {
        user = await Pharmacy.findOne({ _id: _id });
      } catch (error) {
        return next(error);
      }
      const PharmDto = new pharmDto(user);

      req.user = PharmDto;

      next();
      return;
    }
  } catch (error) {
    return next(error);
  }
  
};

module.exports = auth;
