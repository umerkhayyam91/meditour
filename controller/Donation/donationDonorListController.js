const Donation = require("../../models/Donation/donations.js");
const User = require("../../models/User/user.js");

const donationCompanyDonationsController = {
  async getAllDonations(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const donationsPerPage = 10;
      const donationId = req.user._id;
      console.log(donationId)
      const totalDonations = await Donation.countDocuments({ donationId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalDonations / donationsPerPage); // Calculate the total number of pages

      const skip = (page - 1) * donationsPerPage; // Calculate the number of posts to skip based on the current page

      const donations = await Donation.find({ donationId })
        .skip(skip)
        .limit(donationsPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      //   const dataType = typeof donations
      // const medDto = new medDTO(donations);
      return res.status(200).json({
        donations: donations,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getDonor(req, res, next) {
    try {
      const donationId = req.query.donationId;
      const donor = await Donation.findById(donationId);

      if (!donor) {
        const error = new Error("Donor not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ donor });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = donationCompanyDonationsController;
