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
      },
async getRequest(req,res,next){

    try {
        const vehicleCompanyId = req.user._id;
        const requests = await vehicleRequest.find({ vehicleCompanyId , status: "pending"});
        if (requests.length == 0) {
          const error = new Error(" No Request for Vehicle found!");
          error.status = 404;
          return next(error);
        }
        return res.status(200).json({ requests });
      } catch (error) {
        return next(error);
      }


},

async acceptRequest(req, res, next) {
    try {
      const vehicleCompanyId = req.query.vehicleCompanyId;
      const requests = await vehicleRequest.findById(vehicleCompanyId);
      if (!requests) {
        const error = new Error("Request for Vehicle not found!");
        error.status = 404;
        return next(error);
      }
      
      requests.status = "accept";
      await requests.save();
      const onRequest = new vehicleRequest({
        rentACarId: requests.rentACarId,
        userId: requests.userId,
        userName: requests.userName,
        vehicleModel:requests.vehicleModel,
      });
      await onRequest.save();
      return res.status(200).json({
        auth: true,
        message: "  Request for Vehicle Accepted Successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
  async rejectRequest(req, res, next) {
    try {
        const vehicleCompanyId = req.query.vehicleCompanyId;
        const requests = await vehicleRequest.findById(vehicleCompanyId);
        if (!requests) {
        const error = new Error(" Request for Vehicle not found!");
        error.status = 404;
        return next(error);
      }
      await vehicleRequest.findByIdAndDelete(vehicleCompanyId);
      return res.status(200).json({
        auth: true,
        message: " Request for Vehicle rejected successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
}
  
  module.exports = vehicleRequestController;