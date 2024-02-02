const InsuranceRequest = require("../../models/Insurance/insuranceRequest")

const insuranceRequestController = {
    async getAllRequests(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const requestsPerPage = 10;
            const insuranceCompanyId = req.user._id;
            const totalInsurance = await InsuranceRequest.countDocuments({
              insuranceCompanyId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalInsurance / requestsPerPage); // Calculate the total number of pages
      
            const skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page
      
            const insurances = await InsuranceRequest.find({ insuranceCompanyId })
              .skip(skip)
              .limit(requestsPerPage);
            let previousPage = page > 1 ? page - 1 : null;
            let nextPage = page < totalPages ? page + 1 : null;
            return res.status(200).json({
              insurances: insurances,
              auth: true,
              previousPage: previousPage,
              nextPage: nextPage,
            });
          } catch (error) {
            return next(error);
          }
      },

      async addRequests(req,res,next){
        const {insuranceId, userId, userName, insuranceFor} = req.body;
        insuranceCompanyId = req.user._id;
        const request = await new InsuranceRequest({
          insuranceCompanyId,
          insuranceId,
          userId,
          userName,
          insuranceFor
        })
        await request.save();
         res.status(200).json({
          request: request,
          auth: true,
        });
      }
    }
  
  module.exports = insuranceRequestController;