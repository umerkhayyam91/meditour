const Joi = require("joi");
const User = require("../../models/User/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../../dto/user.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

async function getNextMrNo() {
  // Find the latest user in the database and get their mrNo
  const latestUser = await User.findOne({}, 'mrNo').sort({ mrNo: -1 });

  // If there are no users yet, start with "000001"
  const nextMrNo = latestUser
    ? String(Number(latestUser.mrNo) + 1).padStart(6, '0')
    : '000001';

  return nextMrNo;
}

const authController = {
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      gender: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, email, gender, phone, password } = req.body;
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      const error = {
        status: 401,
        message: 'Email Already Registered',
      };

      return next(error);
    }

    let accessToken;
    let refreshToken;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
      // Get the next unique mrNo
      const mrNo = await getNextMrNo();

      // Create a new user with the generated mrNo
      const userToRegister = new User({
        name,
        email,
        gender,
        mrNo,
        phone,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // Token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, '365d');
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, '365d');
    } catch (error) {
      return next(error);
    }
    await JWTService.storeRefreshToken(refreshToken, user._id);
    await JWTService.storeAccessToken(accessToken, user._id);

    // Response send
    return res.status(201).json({ user, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let user;

    try {
      // match username
      const emailRegex = new RegExp(email, "i");
      user = await User.findOne({ email: { $regex: emailRegex } });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (user.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "365d");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "365d");
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    try {
      await AccessToken.updateOne(
        {
          userId: user._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const userDto = new UserDTO(user);

    return res
      .status(200)
      .json({ user: userDto, auth: true, token: accessToken });
  },

  async logout(req, res, next) {
    const userId = req.user._id;
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    try {
      await RefreshToken.deleteOne({ userId });
    } catch (error) {
      return next(error);
    }
    try {
      await AccessToken.deleteOne({ token: accessToken });
    } catch (error) {
      return next(error);
    }

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },
};

module.exports = authController;
