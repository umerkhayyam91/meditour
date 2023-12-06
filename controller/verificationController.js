const VerificationCode = require("../models/verificationCode");
const nodemailer = require("nodemailer");
const Laboratory = require("../models/Laboratory/laboratory");
const Pharmacy = require("../models/Pharmacy/pharmacy");
const Doctor = require("../models/Doctor/doctors");
const Hospital = require("../models/Hospital/hospital");

const verificationController = {
  async sendCodeToEmail(req, res, next) {
    let emailExists;
    const { email } = req.body;
    if (req.originalUrl.includes("/lab")) {
       emailExists = await Laboratory.exists({ email });
    } else if (req.originalUrl.includes("/pharm")) {
       emailExists = await Pharmacy.exists({ email });
    } else if(req.originalUrl.includes("/doc")){
      emailExists = await Doctor.exists({ email });
    } else if(req.originalUrl.includes("/hosp")){
      emailExists = await Hospital.exists({ email });
    }
    if (emailExists) {
      const error = new Error("Email already exists!");
      error.status = 400;
      return next(error);
    }
    try {
      let code;
      var codeToSave = new VerificationCode({
        email: email,
        code: Math.floor(100000 + Math.random() * 900000),
      });
      code = codeToSave.save();

      // Send email (use credintials of SendGrid)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "berryboostbb",
          pass: "wwdrzfmlrfjprypp",
        },
      });
      var mailOptions = {
        from: "no-reply@example.com",
        to: email,
        subject: "Account Verification",
        text:
          "Your verification code is " + codeToSave.code + "\n\nThank You!\n",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          status: true,
          message: ` A verification email has been sent to ${email}`,
        });
      });
    } catch (error) {
      return next(error);
    }
  },

  async confirmEmail(req, res, next) {
    const { code, email } = req.body;
    VerificationCode.findOne({ code: code }, function (err, cod) {
      if (!cod) {
        const error = new Error(
          "Incorrect verification code. Please double-check the code and try again."
        );
        error.status = 400;
        return next(error);
      } else {
        if (email == cod.email) {
          return res.status(200).json({
            status: true,
            message: "Your account has been successfully verified",
          });
        } else {
          return res.status(200).json({
            status: true,
            message:
              "We were unable to find a user for this verification. Please enter a correct email!",
          });
        }
      }
    });
  },
};

module.exports = verificationController;
