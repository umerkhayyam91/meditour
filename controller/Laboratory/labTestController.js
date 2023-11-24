const Tests = require("../../models/Laboratory/tests.js");
const Joi = require("joi");
const TestDTO = require("../../dto/test.js");
const JWTService = require("../../services/JWTService.js");

const labTestController = {
  async addTest(req, res, next) {
    console.log("ali")
    const labTestSchema = Joi.object({
      testName: Joi.string().required(),
      //   testCode: Joi.number().required(),
      testDescription: Joi.string().required(),
      price: Joi.number().required(),
      duration: Joi.string().required(),
      priceForMeditour: Joi.number().required(),
    });

    const { error } = labTestSchema.validate(req.body);

    if (error) {
      return next(error);
    }
const {
  testName,
  //   testCode,
  testDescription,
  price,
  duration,
  priceForMeditour,
} = req.body;

try {
  const testInUse = await Tests.exists({ testName });
  
  if (testInUse) {
    const error = new Error("Test already added, use another TestName!");
    error.status = 409;
    return next(error);
  }
} catch (error) {
  return next(error);
}
let token;
console.log("istafa")
const authHeader = String(req.headers["authorization"] || "");
if (authHeader.startsWith("Bearer ")) {
  token = authHeader.substring(7, authHeader.length);
  // const payload = jwtDecode(token) as JwtPayload;
}
console.log("token....", token);

let verifyAccessToken = JWTService.verifyAccessToken(token);
console.log("verifyAccessToken....", verifyAccessToken);

console.log("hamza")
if (!verifyAccessToken) {
  const error = new Error("Authentication failed!");
  error.status = 401;
  return next(error);
}

console.log("ehtisham")
let test;

let testcod = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999

try {
  const testToRegister = new Tests({
    testName,
    testCode: testcod,
    testDescription,
    price,
    duration,
    priceForMeditour,
  });
  
  console.log("umer")
  test = await testToRegister.save();
} catch (error) {
  return next(error);
}

// 6. response send

const testDto = new TestDTO(test);

return res.status(201).json({ test: testDto, auth: true });
},
};
module.exports = labTestController;
