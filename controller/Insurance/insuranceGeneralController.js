const express = require("express");
const app = express();
const Hospital = require("../../models/Hospital/hospital.js");
const Laboratory = require("../../models/Laboratory/laboratory.js");

const insuranceGeneralController = {
  async getHospitals(req, res, next) {
    try {
      let page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      let hospitalPerPage = 10;
      let insuranceId = req.user._id;
      let search = req.query.search;
      let hospitals;
      let totalHospitals;
      let totalPages;
      let skip;
      if (search) {
        const regex = new RegExp(search, "i"); // Create a case-insensitive regular expression
        console.log(search);
        totalHospitals = await Hospital.countDocuments({ hospitalName: regex });
        totalPages = Math.ceil(totalHospitals / hospitalPerPage); // Calculate the total number of pages
        skip = (page - 1) * hospitalPerPage; // Calculate the number of posts to skip based on the current page
        hospitals = await Hospital.find({ hospitalName: regex })
          .skip(skip)
          .limit(hospitalPerPage);

        // Filter out the hospitals where criteriaId is null (no matching criteriaName)
      } else {
        totalHospitals = await Hospital.countDocuments();
        totalPages = Math.ceil(totalHospitals / hospitalPerPage); // Calculate the total number of pages
        skip = (page - 1) * hospitalPerPage;
        hospitals = await Hospital.find()
          .skip(skip)
          .limit(hospitalPerPage)
          .skip(skip)
          .limit(hospitalPerPage);
      }
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        hospitals: hospitals,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getLabs(req, res, next) {
    try {
      let page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      let labPerPage = 10;
      let insuranceId = req.user._id;
      let search = req.query.search;
      let labs;
      let totalLabs;
      let totalPages;
      let skip;
      if (search) {
        const regex = new RegExp(search, "i"); // Create a case-insensitive regular expression
        console.log(search);
        totalLabs = await Laboratory.countDocuments({ labFirstName: regex });
        totalPages = Math.ceil(totalLabs / labPerPage); // Calculate the total number of pages
        skip = (page - 1) * labPerPage; // Calculate the number of posts to skip based on the current page
        labs = await Laboratory.find({ labFirstName: regex })
          .skip(skip)
          .limit(labPerPage);

        // Filter out the labs where criteriaId is null (no matching criteriaName)
      } else {
        totalLabs = await Laboratory.countDocuments();
        totalPages = Math.ceil(totalLabs / labPerPage); // Calculate the total number of pages
        skip = (page - 1) * labPerPage;
        labs = await Laboratory.find()
          .skip(skip)
          .limit(labPerPage)
          .skip(skip)
          .limit(labPerPage);
      }
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        labs: labs,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = insuranceGeneralController;
