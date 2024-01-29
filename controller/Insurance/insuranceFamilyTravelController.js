const FamilyTravel = require("../../models/Insurance/familyTravelInsurance.js");
const Joi = require("joi");
const familyTravelDTO = require("../../dto/Insurance/familyTravel.js");

const insuranceTravelController = {
  async addFamilyTravel(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      medicalCover: Joi.string(),
      coveringUpto: Joi.string(),
      adndCoverage: Joi.string(),
      repatriationCoverage: Joi.string(),
      medExpensesHospitalizationCoverage: Joi.string(),
      emergencyReturnHomeCoverage: Joi.string(),
      tripCancellation: Joi.string(),
      luggageArrivalDelay: Joi.string(),
      flightDelay: Joi.string(),
      travelStayOverOneFamMember: Joi.string(),
      passportLoss: Joi.string(),
      baggageLoss: Joi.string(),
      policyFile: Joi.string(),
      actualPrice: Joi.string(),
      meditourPrice: Joi.string(),
      perYear: Joi.string(),
      tripType: Joi.string(),
    });

    const { error } = insuranceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      packageName,
      packageLogo,
      medicalCover,
      coveringUpto,
      adndCoverage,
      repatriationCoverage,
      medExpensesHospitalizationCoverage,
      emergencyReturnHomeCoverage,
      tripCancellation,
      luggageArrivalDelay,
      flightDelay,
      travelStayOverOneFamMember,
      passportLoss,
      baggageLoss,
      policyFile,
      actualPrice,
      meditourPrice,
      perYear,
      tripType,
    } = req.body;

    let insurance;
    const insuranceId = req.user._id;
    try {
      const insuranceToRegister = new FamilyTravel({
        packageName,
        packageLogo,
        medicalCover,
        coveringUpto,
        adndCoverage,
        repatriationCoverage,
        medExpensesHospitalizationCoverage,
        emergencyReturnHomeCoverage,
        tripCancellation,
        luggageArrivalDelay,
        flightDelay,
        travelStayOverOneFamMember,
        passportLoss,
        baggageLoss,
        policyFile,
        actualPrice,
        meditourPrice,
        perYear,
        tripType,
      });

      insurance = await insuranceToRegister.save();
      const familyTravelDto = new familyTravelDTO(insurance);

      return res.status(201).json({ insurance: familyTravelDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async editFamilyTravel(req, res, next) {
    const insuranceTravelSchema = Joi.object({
        packageName: Joi.string(),
        packageLogo: Joi.string(),
        medicalCover: Joi.string(),
        coveringUpto: Joi.string(),
        adndCoverage: Joi.string(),
        repatriationCoverage: Joi.string(),
        medExpensesHospitalizationCoverage: Joi.string(),
        emergencyReturnHomeCoverage: Joi.string(),
        tripCancellation: Joi.string(),
        luggageArrivalDelay: Joi.string(),
        flightDelay: Joi.string(),
        travelStayOverOneFamMember: Joi.string(),
        passportLoss: Joi.string(),
        baggageLoss: Joi.string(),
        policyFile: Joi.string(),
        actualPrice: Joi.string(),
        meditourPrice: Joi.string(),
        perYear: Joi.string(),
        tripType: Joi.string(),
    });

    const { error } = insuranceTravelSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
        packageName,
        packageLogo,
        medicalCover,
        coveringUpto,
        adndCoverage,
        repatriationCoverage,
        medExpensesHospitalizationCoverage,
        emergencyReturnHomeCoverage,
        tripCancellation,
        luggageArrivalDelay,
        flightDelay,
        travelStayOverOneFamMember,
        passportLoss,
        baggageLoss,
        policyFile,
        actualPrice,
        meditourPrice,
        perYear,
        tripType,
    } = req.body;

    const insuranceTravelId = req.query.insuranceTravelId;
    const existingInsurance = await FamilyTravel.findById(
      insuranceTravelId
    );

    if (!existingInsurance) {
      const error = new Error("Family Travel not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (packageName) existingInsurance.packageName = packageName;
    if (packageLogo) existingInsurance.packageLogo = packageLogo;
    if (medicalCover) existingInsurance.medicalCover = medicalCover;
    if (coveringUpto) existingInsurance.coveringUpto = coveringUpto;
    if (adndCoverage) existingInsurance.adndCoverage = adndCoverage;
    if (repatriationCoverage)
      existingInsurance.repatriationCoverage = repatriationCoverage;
    if (medExpensesHospitalizationCoverage)
      existingInsurance.medExpensesHospitalizationCoverage =
        medExpensesHospitalizationCoverage;
        if (emergencyReturnHomeCoverage)
          existingInsurance.emergencyReturnHomeCoverage =
            emergencyReturnHomeCoverage;
    if (tripCancellation)
      existingInsurance.tripCancellation =
        tripCancellation;
    if (travelStayOverOneFamMember)
      existingInsurance.travelStayOverOneFamMember =
        travelStayOverOneFamMember;
    if (flightDelay) existingInsurance.flightDelay = flightDelay;
    if (passportLoss) existingInsurance.passportLoss = passportLoss;
    if (luggageArrivalDelay)
      existingInsurance.luggageArrivalDelay = luggageArrivalDelay;
    if (baggageLoss) existingInsurance.baggageLoss = baggageLoss;
    if (policyFile) existingInsurance.policyFile = policyFile;
    if (actualPrice) existingInsurance.actualPrice = actualPrice;
    if (meditourPrice) existingInsurance.meditourPrice = meditourPrice;
    if (perYear) existingInsurance.perYear = perYear;
    if (tripType) existingInsurance.tripType = tripType;

    // Save the updated test
    await existingInsurance.save();

    return res.status(200).json({
      message: "Family Travel updated successfully",
      insurance: existingInsurance,
    });
  },

  async deleteFamilyTravel(req, res, next) {
    const insuranceTravelId = req.query.insuranceTravelId;
    const existingInsurance = await FamilyTravel.findById(
      insuranceTravelId
    );

    if (!existingInsurance) {
      const error = new Error("Family Travel not found!");
      error.status = 404;
      return next(error);
    }
    await FamilyTravel.findByIdAndDelete({ _id: insuranceTravelId });
    return res
      .status(200)
      .json({ message: "Family Travel deleted successfully" });
  },

  async getFamilyTravel(req, res, next) {
    try {
      const insuranceTravelId = req.query.insuranceTravelId;
      const existingInsurance = await FamilyTravel.findById(
        insuranceTravelId
      );

      if (!existingInsurance) {
        const error = new Error("Individual Travel not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ existingInsurance });
    } catch (error) {
      return next(error);
    }
  },

  async getAllFamilyTravel(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const insurancePerPage = 10;
      const insuranceId = req.user._id;
      const totalInsurance = await FamilyTravel.countDocuments({
        insuranceId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalInsurance / insurancePerPage); // Calculate the total number of pages

      const skip = (page - 1) * insurancePerPage; // Calculate the number of posts to skip based on the current page

      const insurances = await FamilyTravel.find({ insuranceId })
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

module.exports = insuranceTravelController;
