const IndividualTravel = require("../../models/Insurance/individualTravelInsurance.js");
const Joi = require("joi");
const individualTravelDTO = require("../../dto/Insurance/individualTravel.js");

const insuranceTravelController = {
  async addIndividualTravel(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      medicalCover: Joi.string(),
      coveringUpto: Joi.string(),
      repatriationCoverage: Joi.string(),
      medExpensesHospitalizationCoverage: Joi.string(),
      returnOfDependentChildrenCoverage: Joi.string(),
      repatriationIllnessInjuryCoverage: Joi.string(),
      emergencyReturnHomeCoverage: Joi.string(),
      medicineDeliveryCoverage: Joi.string(),
      flightDelay: Joi.string(),
      passportLoss: Joi.string(),
      luggageArrivalDelay: Joi.string(),
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
      repatriationCoverage,
      medExpensesHospitalizationCoverage,
      returnOfDependentChildrenCoverage,
      repatriationIllnessInjuryCoverage,
      emergencyReturnHomeCoverage,
      medicineDeliveryCoverage,
      flightDelay,
      passportLoss,
      luggageArrivalDelay,
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
      const insuranceToRegister = new IndividualTravel({
        insuranceId,
        packageName,
        packageLogo,
        medicalCover,
        coveringUpto,
        repatriationCoverage,
        medExpensesHospitalizationCoverage,
        returnOfDependentChildrenCoverage,
        repatriationIllnessInjuryCoverage,
        emergencyReturnHomeCoverage,
        medicineDeliveryCoverage,
        flightDelay,
        passportLoss,
        luggageArrivalDelay,
        baggageLoss,
        policyFile,
        actualPrice,
        meditourPrice,
        perYear,
        tripType,
      });

      insurance = await insuranceToRegister.save();
      const individualTravelDto = new individualTravelDTO(insurance);

      return res
        .status(201)
        .json({ insurance: individualTravelDto, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async editIndividualTravel(req, res, next) {
    const insuranceTravelSchema = Joi.object({
      packageName: Joi.string(),
      packageLogo: Joi.string(),
      medicalCover: Joi.string(),
      coveringUpto: Joi.string(),
      repatriationCoverage: Joi.string(),
      medExpensesHospitalizationCoverage: Joi.string(),
      returnOfDependentChildrenCoverage: Joi.string(),
      repatriationIllnessInjuryCoverage: Joi.string(),
      emergencyReturnHomeCoverage: Joi.string(),
      medicineDeliveryCoverage: Joi.string(),
      flightDelay: Joi.string(),
      passportLoss: Joi.string(),
      luggageArrivalDelay: Joi.string(),
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
      repatriationCoverage,
      medExpensesHospitalizationCoverage,
      returnOfDependentChildrenCoverage,
      repatriationIllnessInjuryCoverage,
      emergencyReturnHomeCoverage,
      medicineDeliveryCoverage,
      flightDelay,
      passportLoss,
      luggageArrivalDelay,
      baggageLoss,
      policyFile,
      actualPrice,
      meditourPrice,
      perYear,
      tripType,
    } = req.body;

    const insuranceTravelId = req.query.insuranceTravelId;
    const existingInsurance = await IndividualTravel.findById(
      insuranceTravelId
    );

    if (!existingInsurance) {
      const error = new Error("Individual Travel not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (packageName) existingInsurance.packageName = packageName;
    if (packageLogo) existingInsurance.packageLogo = packageLogo;
    if (medicalCover) existingInsurance.medicalCover = medicalCover;
    if (coveringUpto) existingInsurance.coveringUpto = coveringUpto;
    if (repatriationCoverage)
      existingInsurance.repatriationCoverage = repatriationCoverage;
    if (medExpensesHospitalizationCoverage)
      existingInsurance.medExpensesHospitalizationCoverage =
        medExpensesHospitalizationCoverage;
    if (returnOfDependentChildrenCoverage)
      existingInsurance.returnOfDependentChildrenCoverage =
        returnOfDependentChildrenCoverage;
    if (repatriationIllnessInjuryCoverage)
      existingInsurance.repatriationIllnessInjuryCoverage =
        repatriationIllnessInjuryCoverage;
    if (emergencyReturnHomeCoverage)
      existingInsurance.emergencyReturnHomeCoverage =
        emergencyReturnHomeCoverage;
    if (medicineDeliveryCoverage)
      existingInsurance.medicineDeliveryCoverage = medicineDeliveryCoverage;
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
      message: "Individual Travel updated successfully",
      insurance: existingInsurance,
    });
  },

  async deleteIndividualTravel(req, res, next) {
    const insuranceTravelId = req.query.insuranceTravelId;
    const existingInsurance = await IndividualTravel.findById(
      insuranceTravelId
    );

    if (!existingInsurance) {
      const error = new Error("Individual Travel not found!");
      error.status = 404;
      return next(error);
    }
    await IndividualTravel.findByIdAndDelete({ _id: insuranceTravelId });
    return res
      .status(200)
      .json({ message: "Individual Travel deleted successfully" });
  },

  async getIndividualTravel(req, res, next) {
    try {
      const insuranceTravelId = req.query.insuranceTravelId;
      const existingInsurance = await IndividualTravel.findById(
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

  async getAllIndividualTravel(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const insurancePerPage = 10;
      const insuranceId = req.user._id;
      const totalinsurance = await IndividualTravel.countDocuments({
        insuranceId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalinsurance / insurancePerPage); // Calculate the total number of pages

      const skip = (page - 1) * insurancePerPage; // Calculate the number of posts to skip based on the current page

      const insurances = await IndividualTravel.find({ insuranceId })
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
