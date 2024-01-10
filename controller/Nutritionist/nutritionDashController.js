const Nutrition = require("../../models/Nutritionist/nutritionist.js");
const User = require("../../models/user.js");
const Appointment = require("../../models/All Doctors Models/appointment.js");
const moment = require("moment");

async function getAppCountForWeek(docId, startDate, endDate) {
  const days = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    const nextDate = moment(currentDate).endOf("day");
    // Modify this query based on your actual data structure
    const appointmentCount = await Appointment.find({
      createdAt: { $gte: currentDate, $lt: nextDate },
      doctorId: docId,
    }).countDocuments();

    days.push({
      date: currentDate.format("YYYY-MM-DD"),
      appointmentCount,
    });

    currentDate.add(1, "days");
  }

  return days;
}

const docDashController = {
  async dashDetails(req, res, next) {
    try {
      const doctorId = req.user._id;
      const doctor = await Nutrition.findById(doctorId);
      const doctorName = doctor.name;
      const upcomingAppointment = await Appointment.findOne({doctorId})
        .sort({ createdAt: -1 }) // Sort in descending order based on createdAt
        .limit(1);

      const currentDate = new Date();
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

      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(currentDate.getDate() - 7);

      // Set the time to the beginning of the week
      weekStartDate.setHours(0, 0, 0, 0);

      const lastWeekStartDate = new Date(currentDate);
      lastWeekStartDate.setDate(currentDate.getDate() - 14);

      // Set the time to the beginning of the week
      lastWeekStartDate.setHours(0, 0, 0, 0);

      const duration = req.query.duration;
      if (!duration) {
        const error = {
          status: 400,
          message: "Duration Period Missing",
        };

        return next(error);
      }

      if (duration == "today") {
        const todayPatientCount = await Appointment.find({
          createdAt: { $gte: currentDate, $lt: new Date() },
          doctorId,
        })
          .distinct("patientId")
          .then((patientIds) => patientIds.length);

        const yesPatientCount = await Appointment.find({
          createdAt: { $gte: yesterdayDate, $lt: currentDate },
          doctorId,
        })
          .distinct("patientId")
          .then((patientIds) => patientIds.length);

          let patientPercentageChange;
          if (yesPatientCount === 0) {
            patientPercentageChange = todayPatientCount * 100; // If last week's orders are zero, the change is undefined
          } else {
            patientPercentageChange = (
              ((todayPatientCount - yesPatientCount) / yesPatientCount) *
              100
            ).toFixed(2);
          }
  
          if (patientPercentageChange > 0) {
            patientPercentageChange = "+" + patientPercentageChange + "%";
          } else {
            patientPercentageChange = patientPercentageChange + "%";
          }

        const todayAppointCount = await Appointment.countDocuments({
          createdAt: { $gte: currentDate, $lt: new Date() },
          doctorId,
        });

        const yesAppointCount = await Appointment.countDocuments({
          createdAt: { $gte: yesterdayDate, $lt: currentDate },
          doctorId,
        });

        let appointmentPercentageChange;
        if (yesAppointCount === 0) {
          appointmentPercentageChange = todayAppointCount * 100; // If last week's orders are zero, the change is undefined
        } else {
          appointmentPercentageChange = (
            ((todayAppointCount - yesAppointCount) / yesAppointCount) *
            100
          ).toFixed(2);
        }

        if (appointmentPercentageChange > 0) {
          appointmentPercentageChange = "+" + appointmentPercentageChange + "%";
        } else {
          appointmentPercentageChange = appointmentPercentageChange + "%";
        }
        return res.json({
          doctorName: doctorName,
          upcomingAppointment: upcomingAppointment,
          todayPatientCount: todayPatientCount,
          patientPercentageChange: patientPercentageChange,
          todayAppointCount: todayAppointCount,
          appointmentPercentageChange: appointmentPercentageChange,
        });
      } else if (duration == "week") {
        const weekPatientCount = await Appointment.find({
          createdAt: { $gte: weekStartDate, $lt: new Date() },
          doctorId,
        })
          .distinct("patientId")
          .then((patientIds) => patientIds.length);

        const lastWeekPatientCount = await Appointment.find({
          createdAt: { $gte: lastWeekStartDate, $lt: weekStartDate },
          doctorId,
        })
          .distinct("patientId")
          .then((patientIds) => patientIds.length);

          let patientPercentageChange;
          if (lastWeekPatientCount === 0) {
            patientPercentageChange = weekPatientCount * 100; // If last week's orders are zero, the change is undefined
          } else {
            patientPercentageChange = (
              ((weekPatientCount - lastWeekPatientCount) / lastWeekPatientCount) *
              100
            ).toFixed(2);
          }
          if (patientPercentageChange > 0) {
            patientPercentageChange = "+" + patientPercentageChange + "%";
          } else {
            patientPercentageChange = patientPercentageChange + "%";
          }

        const weekAppointCount = await Appointment.countDocuments({
          createdAt: { $gte: weekStartDate, $lt: new Date() },
          doctorId,
        });

        const lastWeekAppointCount = await Appointment.countDocuments({
          createdAt: { $gte: lastWeekStartDate, $lt: weekStartDate },
          doctorId,
        });

        let appointmentPercentageChange;
        if (lastWeekAppointCount === 0) {
          appointmentPercentageChange = weekAppointCount * 100; // If last week's orders are zero, the change is undefined
        } else {
          appointmentPercentageChange = (
            ((weekAppointCount - lastWeekAppointCount) / lastWeekAppointCount) *
            100
          ).toFixed(2);
        }

        if (appointmentPercentageChange > 0) {
          appointmentPercentageChange = "+" + appointmentPercentageChange + "%";
        } else {
          appointmentPercentageChange = appointmentPercentageChange + "%";
        }

        return res.json({
          doctorName: doctorName,
          upcomingAppointment: upcomingAppointment,
          weekPatientCount: weekPatientCount,
          patientPercentageChange: patientPercentageChange,
          weekAppointCount: weekAppointCount,
          appointmentPercentageChange: appointmentPercentageChange,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async graph(req, res, next) {
    try {
      // Calculate date ranges for the current week (including previous 7 days) and previous week
      const today = moment().startOf("day");
      const currentWeekStart = moment(today).subtract(7, "days").startOf("day");
      const currentWeekEnd = moment(today).endOf("day");
      const previousWeekStart = moment(currentWeekStart).subtract(7, "days");
      const previousWeekEnd = moment(currentWeekStart).subtract(1, "days");

      // Fetch data for the current week (including previous 7 days)
      const currentWeekData = await getAppCountForWeek(
        req.user._id,
        currentWeekStart,
        currentWeekEnd
      );

      // Fetch data for the previous week
      const previousWeekData = await getAppCountForWeek(
        req.user._id,
        previousWeekStart,
        previousWeekEnd
      );

      res.json({ currentWeekData, previousWeekData });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = docDashController;
