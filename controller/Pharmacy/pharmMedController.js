const Medicines = require("../../models/Pharmacy/medicine.js");
const Joi = require("joi");
const medDTO = require("../../dto/med.js");

const pharmMedController = {
  async addMed(req, res, next) {
    console.log("object")
    const pharmMedSchema = Joi.object({
      generic: Joi.string().required(),
      medicineBrand: Joi.string().required(),
      medicineType: Joi.string().required(),
      strength: Joi.string().required(),
      packSize: Joi.string().required(),
      priceMeditour: Joi.number().required(),
      actualPrice: Joi.number().required(),
    });

    const { error } = pharmMedSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    console.log("req.user._id")
    // const pharmId = req.user._id;
    const {
      generic,
      medicineBrand,
      medicineType,
      strength,
      packSize,
      priceMeditour,
      actualPrice,
    } = req.body;
    // try {
    //   const testInUse = await Tests.exists({ testName, pharmId });

    //   if (testInUse) {
    //     const error = new Error("Test already added, use another TestName!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }
    let med;

    let medCode = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999

    try {
      const medToRegister = new Medicine({
        pharmId,
        medCode,
        generic,
        medicineBrand,
        medicineType,
        strength,
        packSize,
        priceMeditour,
        actualPrice,
      });

      med = await medToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    const medDto = new medDTO(med);

    return res.status(201).json({ med: medDto, auth: true });
  },

  async editTest(req, res, next) {
    const labTestSchema = Joi.object({
      testName: Joi.string(),
      testDescription: Joi.string(),
      price: Joi.number(),
      duration: Joi.string(),
      priceForMeditour: Joi.number(),
    });

    const { error } = labTestSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { testName, testDescription, price, duration, priceForMeditour } =
      req.body;
    const labId = req.user._id;
    console.log(labId);
    try {
      const testInUse = await Tests.exists({ testName, labId });

      if (testInUse) {
        const error = new Error("Test already added, use another TestName!");
        error.status = 409;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const testId = req.query.testId;
    const existingTest = await Tests.findById(testId);

    if (!existingTest) {
      const error = new Error("Test not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (testName) existingTest.testName = testName;
    if (testDescription) existingTest.testDescription = testDescription;
    if (price) existingTest.price = price;
    if (duration) existingTest.duration = duration;
    if (priceForMeditour) existingTest.priceForMeditour = priceForMeditour;

    // Save the updated test
    await existingTest.save();

    return res
      .status(200)
      .json({ message: "Test updated successfully", test: existingTest });
  },

  async deleteTest(req, res, next) {
    const testId = req.query.testId;
    const existingTest = await Tests.findById(testId);

    if (!existingTest) {
      const error = new Error("Test not found!");
      error.status = 404;
      return next(error);
    }
    await Tests.deleteOne({ testId });
    return res.status(200).json({ message: "Test deleted successfully" });
  },

  async getTest(req, res, next) {
    try {
      const testId = req.query.testId;
      const test = await Tests.findById(testId);

      if (!test) {
        const error = new Error("Test not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ test });
    } catch (error) {
      return next(error);
    }
  },

  async getAllTests(req, res, next) {
    try {
      const tests = await Tests.find();

      if (!tests) {
        const error = new Error("No Test Found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ tests, auth: true });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = pharmMedController;
