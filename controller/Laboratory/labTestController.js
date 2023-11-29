const Tests = require("../../models/Laboratory/tests.js");
const Joi = require("joi");
const TestDTO = require("../../dto/test.js");
const JWTService = require("../../services/JWTService.js");
const Order = require("../../models/Laboratory/labOrder.js");



const labTestController = {
  async addTest(req, res, next) {
    const labTestSchema = Joi.object({
      testName: Joi.string().required(),
      testDescription: Joi.string().required(),
      price: Joi.number().required(),
      duration: Joi.string().required(),
      priceForMeditour: Joi.number().required(),
    });

    const { error } = labTestSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { testName, testDescription, price, duration, priceForMeditour } =
      req.body;
    const labId = req.user._id;
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

    let test;

    let testCode = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999

    try {
      const testToRegister = new Tests({
        labId,
        testCode,
        testName,
        testDescription,
        price,
        duration,
        priceForMeditour,
      });

      test = await testToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send

    const testDto = new TestDTO(test);

    return res.status(201).json({ test: testDto, auth: true });
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
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const testPerPage = 10;
      const labId = req.user.id;
      const totalTests = await Tests.countDocuments({ labId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalTests / testPerPage); // Calculate the total number of pages

      const skip = (page - 1) * testPerPage; // Calculate the number of posts to skip based on the current page

      const tests = await Tests
        .find({ labId })
        .skip(skip)
        .limit(testPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      const testDto = new TestDTO(tests);
      return res
        .status(200)
        .json({
          tests: testDto,
          auth: true,
          previousPage: previousPage,
          nextPage: nextPage,
        }); 
    } catch (error) {
      return next(error);
    }
  },

 
};
module.exports = labTestController;
