const VerificationCode = require("../models/verificationCode");
const nodemailer = require("nodemailer");
const Laboratory = require("../models/Laboratory/laboratory");
const Pharmacy = require("../models/Pharmacy/pharmacy");
const Doctor = require("../models/Doctor/doctors");
const Hospital = require("../models/Hospital/hospital");
const AmbulanceCompany = require("../models/Ambulance/ambulanceCompany");
const Physiotherapist = require("../models/Physiotherapist/physiotherapist");
const ResetToken = require("../models/resetToken");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const tokens = {};
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

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
    } else if(req.originalUrl.includes("/ambulance")){
      emailExists = await AmbulanceCompany.exists({ email });
    } else if(req.originalUrl.includes("/physio")){
      emailExists = await Physiotherapist.exists({ email });
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

  async ResetLink(req,res,next){
    try {
      const { email } = req.body;
      console.log(email);
      if (!email) {
          return res.status(404).json({ status: 'failure', message: 'Please enter email' });
      }
      const existingUser = await Laboratory.findOne({ email });

      if (!existingUser) {
          return res.status(404).json({ status: 'failure', message: 'Email not found' });
      }

      // Generate a random password reset token
      const resetToken = uuidv4();
      // Save the resetToken and associated email in your database
      const token =  new ResetToken({ token: resetToken, email });

      tokens[resetToken] = email;
      console.log(tokens);
      // Create a reset link with the token
      const resetLink = `http://localhost:5001/lab/resetPassword?token=${resetToken}`;

      // Send an email with the reset link using Mailgun
      // const data = {
      //     from: 'ShareRoom@gmail.com',
      //     to: "umerkhayyam91@gmail.com",
      //     subject: 'Payment',
      //     html: `<p>Click the link below to reset your password:</p>${resetLink}`,
      // }

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
        subject: "Reset Password",
        html: `<p>Click the link below to reset your password:</p>${resetLink}`
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          status: true,
          message: `Password reset link sent to ${email}`,
        });
      })
      // mailgun.messages().send(data, (error, body) => {
      //     if (error) {
      //         console.error('Error sending email:', error);
      //         return res.status(500).json({ status: 'failure', message: 'Failed to send email' });
      //     }

      //     return res.json({ status: 'success', message: 'Password reset link sent to your email' });
      // });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
  },

  async resetPassword(req,res,next){
    try {
      const resetSchema = Joi.object({
        password: Joi.string().pattern(passwordPattern).required()
      });
  
      const { error } = resetSchema.validate(req.body);
  
      // 2. if error in validation -> return error via middleware
      if (error) {
        return next(error);
      }
      const token = req.query.token;
      const { newPassword } = req.body;
      if (!newPassword) {
          res.json({
              'status': 'Failure',
              'message': `Please enter new password`,
          });
          return;
      }
      // Check if the provided token exists in the tokens object
      const email = tokens[token];
      console.log(tokens)
      if (!email) {
          return res.status(404).json({ status: 'failure', message: 'Invalid token' });
      }
      console.log(email);

      const user = await Laboratory.find({ email })
      if (!user) {
          return res.status(404).json({ status: 'Failure', message: 'User not found' });
      }
      console.log(user);
      if (newPassword.length < 8) {
          return res.json({
              'status': 'Failure',
              'message': "Password must be at least 8 characters long",
          });
      }
      // In a real application, you should update the user's password in your database
      // For this demo, we'll just log the new password
      console.log(`Password for ${email} reset to: ${newPassword}`);

      // Delete the token from the tokens object after it's used
      delete tokens[token];
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await Laboratory.updateOne({ email: email }, { password: hashedNewPassword }, { runValidators: true });

      return res.json({ status: 'success', message: 'Password reset successful' });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
  }
};

module.exports = verificationController;
