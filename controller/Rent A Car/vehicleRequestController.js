const vehicleRequest = require("../../models/Rent A Car/vehicleRequest");

const vehicleRequestController = {
    async getAllRequests(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const requestsPerPage = 10;
            const vehicleCompanyId= req.user._id;
            const totalVehicle = await vehicleRequest.countDocuments({
              vehicleCompanyId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalVehicle / requestsPerPage); // Calculate the total number of pages
      
            const skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page
      
            const vehicles = await vehicleRequest.find({ vehicleCompanyId })
              .skip(skip)
              .limit(requestsPerPage);
            let previousPage = page > 1 ? page - 1 : null;
            let nextPage = page < totalPages ? page + 1 : null;
            return res.status(200).json({
              vehicles: vehicles,
              auth: true,
              previousPage: previousPage,
              nextPage: nextPage,
            });
          } catch (error) {
            return next(error);
          }
      },

      async addRequests(req,res,next){
        console.log("first")
        const {rentACarId, userId, userName, vehicleModel} = req.body;
        vehicleCompanyId = req.user._id;
        const request = new vehicleRequest({
          vehicleCompanyId,
          rentACarId,
          userId,
          userName,
          vehicleModel,
        })
        await request.save();
         res.status(200).json({
          request: request,
          auth: true,
        });
      }
    }
  
  module.exports = vehicleRequestController;