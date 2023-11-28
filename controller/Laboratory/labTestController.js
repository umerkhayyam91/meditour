const Tests = require("../../models/Laboratory/tests.js");
const Joi = require("joi");
const TestDTO = require("../../dto/test.js");
const JWTService = require("../../services/JWTService.js");
const Order = require("../../models/Laboratory/order.js");

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

  async dashDetails(req, res, next) {
    try {
      // Get the current date
      const currentDate = new Date();
      console.log(currentDate);
  
      // Set the time to the beginning of the day
      currentDate.setHours(0, 0, 0, 0);
  
      // Calculate yesterday's date
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);
  
      // Set the time to the beginning of yesterday
      yesterdayDate.setHours(0, 0, 0, 0);

      const dayBeforeYesterday = new Date(currentDate);
      dayBeforeYesterday.setDate(currentDate.getDate() - 2);
  
      // Set the time to the beginning of the day before yesterday
      dayBeforeYesterday.setHours(0, 0, 0, 0);
  
      // Fetch the count of orders for the day before yesterday
      const penDayBefYesCount = await Tests.countDocuments({
        createdAt: { $gte: dayBeforeYesterday, $lt: yesterdayDate },
        status: "pending"
      });
      // Fetch the count of orders for yesterday
      const yesterdayOrdersCount = await Tests.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
      });

      const pendingYesOrdersCount = await Tests.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        status: "pending"
      });
  
      // Fetch the count of orders for today
      const todayOrdersCount = await Tests.countDocuments({
        createdAt: { $gte: currentDate, $lt: new Date() },
      });

      const completeTodayOrdersCount = await Tests.countDocuments({
        createdAt: { $gte: currentDate, $lt: new Date() },
        status: "completed"
      });

      const completeYesOrdersCount = await Tests.countDocuments({
        createdAt: { $gte: yesterdayDate, $lt: currentDate },
        status: "completed"
      });

      let pendingPercentageChange;
      if (penDayBefYesCount === 0) {
        pendingPercentageChange = pendingYesOrdersCount * 100 + "%"; // If the day before yesterday's orders are zero, the change is undefined
      } else {
        pendingPercentageChange = (((pendingYesOrdersCount - penDayBefYesCount) / penDayBefYesCount) * 100).toFixed(2) + "%";
      } 

      // Handle the case where yesterday's orders are zero
      let newOrdersPercentageChange;
      if (yesterdayOrdersCount === 0) {
        newOrdersPercentageChange = todayOrdersCount * 100 + "%"; // If yesterday's orders are zero, the change is undefined
      } else {
           newOrdersPercentageChange = (((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100).toFixed(2) + "%";
      }

      let comOrdersPercentageChange;
      if (completeYesOrdersCount === 0) {
        comOrdersPercentageChange = completeTodayOrdersCount * 100 + "%"; // If yesterday's orders are zero, the change is undefined
      } else {
           comOrdersPercentageChange = (((completeTodayOrdersCount - completeYesOrdersCount) / completeYesOrdersCount) * 100).toFixed(2) + "%";
      }

      res.json({ todayOrdersCount, newOrdersPercentageChange, pendingYesOrdersCount, pendingPercentageChange, completeTodayOrdersCount, comOrdersPercentageChange });
    } catch (error) {
      next(error);
    }
  }
};
module.exports = labTestController;
