const FamilyHealth = require("../../models/Insurance/familyHealthInsurance.js");
const Joi = require("joi");
const familyHealthDTO = require("../../dto/Insurance/familyHealth.js");

const insuranceHealthController = {
  async addFamilyHealth(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      yourAgeCriteria: Joi.object(),
      spouseAgeCriteria: Joi.object(),
      kidsAge: Joi.object(),
      hospitalizationLimit: Joi.object(),
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      hospitalizationPerPerson: Joi.string(),
      dailyRoomAndBoardLimit: Joi.string(),
      claimPayoutRatio: Joi.string(),
      hospitals: Joi.array(),
      laboratories: Joi.array(),
      icuCcuLimits: Joi.string(),
      accidentalEmergencyLimits: Joi.string(),
      ambulanceCoverage: Joi.string(),
      OPD: Joi.string(),
      waitingPeriod: Joi.string(),
      policyDocument: Joi.string(),
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
      yourAgeCriteria,
      spouseAgeCriteria,
      kidsAge,
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
      OPD,
      waitingPeriod,
      policyDocument,
      heading,
      description,
      actualPrice,
      meditourPrice,
      perYear,
    } = req.body;

    let insurance;
    const insuranceId = req.user._id;
    try {
      const insuranceToRegister = new FamilyHealth({
        insuranceId,
        yourAgeCriteria,
        spouseAgeCriteria,
        kidsAge,
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
        OPD,
        waitingPeriod,
        policyDocument,
        heading,
        description,
        actualPrice,
        meditourPrice,
        perYear,
      });

      insurance = await insuranceToRegister.save();
      const familyHealthDto = new familyHealthDTO(insurance);

      return res.status(201).json({ insurance: familyHealthDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async editFamilyHealth(req, res, next) {
    const insuranceHealthSchema = Joi.object({
      yourAgeCriteria: Joi.object(),
      spouseAgeCriteria: Joi.object(),
      kidsAge: Joi.object(),
      hospitalizationLimit: Joi.object(),
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      hospitalizationPerPerson: Joi.string(),
      dailyRoomAndBoardLimit: Joi.string(),
      claimPayoutRatio: Joi.string(),
      hospitals: Joi.array(),
      laboratories: Joi.array(),
      icuCcuLimits: Joi.string(),
      accidentalEmergencyLimits: Joi.string(),
      ambulanceCoverage: Joi.string(),
      OPD: Joi.string(),
      waitingPeriod: Joi.string(),
      policyDocument: Joi.string(),
      heading: Joi.string(),
      description: Joi.string(),
      actualPrice: Joi.string(),
      meditourPrice: Joi.string(),
      perYear: Joi.string(),
    });

    const { error } = insuranceHealthSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      yourAgeCriteria,
      spouseAgeCriteria,
      kidsAge,
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
      OPD,
      waitingPeriod,
      policyDocument,
      heading,
      description,
      actualPrice,
      meditourPrice,
      perYear,
    } = req.body;

    const insuranceHealthId = req.query.insuranceHealthId;
    const existingInsurance = await FamilyHealth.findById(insuranceHealthId);

    if (!existingInsurance) {
      const error = new Error("Family Health not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (yourAgeCriteria) existingInsurance.yourAgeCriteria = yourAgeCriteria;
    if (spouseAgeCriteria)
      existingInsurance.spouseAgeCriteria = spouseAgeCriteria;
    if (kidsAge) existingInsurance.kidsAge = kidsAge;
    if (hospitalizationLimit)
      existingInsurance.hospitalizationLimit = hospitalizationLimit;
    if (packageName) existingInsurance.packageName = packageName;
    if (packageLogo) existingInsurance.packageLogo = packageLogo;
    if (hospitalizationPerPerson)
      existingInsurance.hospitalizationPerPerson = hospitalizationPerPerson;
    if (dailyRoomAndBoardLimit)
      existingInsurance.dailyRoomAndBoardLimit = dailyRoomAndBoardLimit;
    if (claimPayoutRatio) existingInsurance.claimPayoutRatio = claimPayoutRatio;
    if (hospitals) existingInsurance.hospitals = hospitals;
    if (laboratories) existingInsurance.laboratories = laboratories;
    if (icuCcuLimits) existingInsurance.icuCcuLimits = icuCcuLimits;
    if (accidentalEmergencyLimits)
      existingInsurance.accidentalEmergencyLimits = accidentalEmergencyLimits;
    if (ambulanceCoverage)
      existingInsurance.ambulanceCoverage = ambulanceCoverage;
    if (OPD) existingInsurance.OPD = OPD;
    if (waitingPeriod) existingInsurance.waitingPeriod = waitingPeriod;
    if (policyDocument) existingInsurance.policyDocument = policyDocument;
    if (heading) existingInsurance.heading = heading;
    if (description) existingInsurance.description = description;
    if (actualPrice) existingInsurance.actualPrice = actualPrice;
    if (meditourPrice) existingInsurance.meditourPrice = meditourPrice;
    if (perYear) existingInsurance.perYear = perYear;

    // Save the updated test
    await existingInsurance.save();

    return res.status(200).json({
      message: "Family Health updated successfully",
      insurance: existingInsurance,
    });
  },

  async deleteFamilyHealth(req, res, next) {
    const insuranceHealthId = req.query.insuranceHealthId;
    const existingInsurance = await FamilyHealth.findById(insuranceHealthId);

    if (!existingInsurance) {
      const error = new Error("Family Health not found!");
      error.status = 404;
      return next(error);
    }
    await FamilyHealth.findByIdAndDelete({ _id: insuranceHealthId });
    return res
      .status(200)
      .json({ message: "Family Health deleted successfully" });
  },

  async getFamilyHealth(req, res, next) {
    try {
      const insuranceHealthId = req.query.insuranceHealthId;
      const existingInsurance = await FamilyHealth.findById(insuranceHealthId);

      if (!existingInsurance) {
        const error = new Error("Family Health not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ existingInsurance });
    } catch (error) {
      return next(error);
    }
  },

  async getAllFamilyHealth(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const insurancePerPage = 10;
      const insuranceId = req.user._id;
      const totalinsurance = await FamilyHealth.countDocuments({
        insuranceId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalinsurance / insurancePerPage); // Calculate the total number of pages

      const skip = (page - 1) * insurancePerPage; // Calculate the number of posts to skip based on the current page

      const insurances = await FamilyHealth.find({ insuranceId })
        .skip(skip)
        .limit(insurancePerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        insurances: insurances,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = insuranceHealthController;
