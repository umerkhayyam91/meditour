const DonorList = require("../../models/Donation/donorList.js");
const User = require("../../models/User/user.js");

const donationDonorListController = {
  async getAllDonations(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const donorListPerPage = 10;
      const donationId = req.user._id;
      const totaldonorList = await DonorList.countDocuments({ donationId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totaldonorList / donorListPerPage); // Calculate the total number of pages

      const skip = (page - 1) * donorListPerPage; // Calculate the number of posts to skip based on the current page

      const donorLists = await DonorList.find({ donationId })
        .skip(skip)
        .limit(donorListPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      //   const dataType = typeof donorLists
      // const medDto = new medDTO(donorLists);
      return res.status(200).json({
        donorLists: donorLists,
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
      const donorId = req.query.donorId;
      const donor = await User.findById(donorId);

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

module.exports = donationDonorListController;
