const VerificationCode = require("../models/verificationCode");
const nodemailer = require("nodemailer");

const verificationController = {
  async sendCodeToEmail(req, res, next) {
    const { email } = req.body;
    const alreadySent = await VerificationCode.exists({ email });
    if (alreadySent) {
      return res.status(400).send({
        message:
          "Your verification code has been sent.",
      });
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

        return res
          .status(200)
          .send("A verification email has been sent to " + email);
      });
    } catch (error) {
      return next(error);
    }
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
        if (email == cod.email) {
          return res
            .status(200)
            .send("Your account has been successfully verified");
        } else {
          return res.status(401).send({
            msg: "We were unable to find a user for this verification. Please enter a correct email!",
          });
        }
      }
    });
  },

};

module.exports = verificationController;
