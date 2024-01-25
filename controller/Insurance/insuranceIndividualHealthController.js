const express = require("express");
const app = express();
const Insurance = require("../../models/Insurance/insurance.js");
const IndividualHealth = require("../../models/Insurance/individualHealthInsurance.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const insuranceDTO = require("../../dto/insurance.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const insuranceHealthController = {
  async addIndividualHealth(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      ageCriteria: Joi.string(),
      hospitalizationLimit: Joi.string(),
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      hospitalizationPerPerson: Joi.string(),
      dailyRoomAndBoardLimit: Joi.string(),
      claimPayoutRatio: Joi.string(),
      hospitals: Joi.string(),
      laboratories: Joi.string(),
      icuCcuLimits: Joi.string(),
      accidentalEmergencyLimits: Joi.string(),
      ambulanceCoverage: Joi.string(),
      specializedInvestigationCoverage: Joi.string(),
      waitingPeriod: Joi.string(),
      maternity: Joi.string(),
      policyDocument: Joi.string(),
      claimProcess: Joi.string(),
      heading: Joi.string(),
      description: Joi.string(),
      actualPrice: Joi.string(),
      meditourPrice: Joi.string(),
      perYear: Joi.string(),
    });

    const { error } = insuranceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      ageCriteria,
      hospitalizationLimit,
      packageName,
      packageLogo,
      hospitalizationPerPerson,
      dailyRoomAndBoardLimit,
      claimPayoutRatio,
      hospitals,
      laboratories,
      icuCcuLimits,
      accidentalEmergencyLimits,
      ambulanceCoverage,
      specializedInvestigationCoverage,
      waitingPeriod,
      maternity,
      policyDocument,
      claimProcess,
      heading,
      description,
      actualPrice,
      meditourPrice,
      perYear,
    } = req.body;

    let insurance;
    const insuranceId = req.user._id;
    try {
      const insuranceToRegister = new IndividualHealth({
        insuranceId,
        ageCriteria,
        hospitalizationLimit,
        packageName,
        packageLogo,
        hospitalizationPerPerson,
        dailyRoomAndBoardLimit,
        claimPayoutRatio,
        hospitals,
        laboratories,
        icuCcuLimits,
        accidentalEmergencyLimits,
        ambulanceCoverage,
        specializedInvestigationCoverage,
        waitingPeriod,
        maternity,
        policyDocument,
        claimProcess,
        heading,
        description,
        actualPrice,
        meditourPrice,
        perYear,
      });

      insurance = await insuranceToRegister.save();
      const medDto = new medDTO(med);

      return res.status(201).json({ med: medDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = insuranceHealthController;
