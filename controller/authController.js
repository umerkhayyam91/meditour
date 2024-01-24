const Joi = require("joi");
const User = require("../models/user");
const VerificationCode = require("../models/verificationCode");
const bcrypt = require("bcryptjs");
var randomBytes = require("randombytes");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");
const nodemailer = require("nodemailer");
var moment = require("moment");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    // 1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const { username, email, password } = req.body;

    try {
      // const usernameInUse = await User.exists({ username });
      const emailInUse = await User.exists({ email });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };

        return next(error);
      }

      // if (usernameInUse) {
      //   const error = {
      //     status: 409,
      //     message: "Username not available, choose another username!",
      //   };

      //   return next(error);
      // }
    } catch (error) {
      return next(error);
    }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db
    let accessToken;
    let refreshToken;

    let user;

    try {
      const userToRegister = new User({
        username,
        email,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

      // generate code and save
      let code;
      var codeToSave = new VerificationCode({
        _userId: user._id,
        code: Math.floor(100000 + Math.random() * 900000),
      });
      code = codeToSave.save();

      // Send email (use credintials of SendGrid)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "umairyaqub31",
          pass: "bxchemglzshkaaym",
        },
      });
      var mailOptions = {
        from: "no-reply@example.com",
        to: user.email,
        subject: "Account Verification",
        text:
          "Hello " +
          username +
          ",\n\n" +
          "Your verification code is " +
          codeToSave.code +
          "\n\nThank You!\n",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return next(err);
        }

        return res
          .status(200)
          .send("A verification email has been sent to " + user.email);
      });
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // 6. response send

    // const userDto = new UserDTO(user);

    // return res
    //   .status(201)
    //   .json({ user: userDto, auth: true, token: accessToken });
  },
  async confirmEmail(req, res, next) {
    const { code, email } = req.body;
    VerificationCode.findOne({ code: code }, function (err, cod) {
      if (!cod) {
        return res.status(400).send({
          message:
            "Your verification code may have expired. Please click on resend for verify your Email.",
        });
      } else {
        User.findOne({ _id: cod._userId, email: email }, function (err, user) {
          // not valid user
          if (!user) {
            return res.status(401).send({
              msg: "We were unable to find a user for this verification. Please SignUp!",
            });
          }
          // user is already verified
          else if (user.isVerified) {
            return res
              .status(200)
              .send("User has been already verified. Please Login");
          }
          // verify user
          else {
            // change isVerified to true
            user.isVerified = true;
            user.save(function (err) {
              // error occur
              if (err) {
                return next(err);
              }
              // account successfully verified
              else {
                return res
                  .status(200)
                  .send("Your account has been successfully verified");
              }
            });
          }
        });
      }

     
    });
  },

  async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error
    // 3. match username and password
    // 4. return response

    // we expect input data to be in such shape
    const userLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

    let user;

    try {
      // match username
      user = await User.findOne({ email: email });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };

        return next(error);
      }

      // match password
      // req.body.password -> hash -> match

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }

      if (!user.isVerified) {
        return res
          .status(401)
          .json({ message: "Not verified", isVerified: user.isVerified });
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);

    return res
      .status(200)
      .json({ user: userDto, auth: true, token: accessToken });
  },
  async logout(req, res, next) {
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
