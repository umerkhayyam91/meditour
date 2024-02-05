const acceptedRequests = require("../../models/Rent A Car/acceptedRequests");
const vehicleRequest = require("../../models/Rent A Car/vehicleRequest");

const vehicleRequestController = {
    async getAllRequests(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            const requestsPerPage = 10;
            const rentACarId= req.user._id;
            const totalVehicle = await vehicleRequest.countDocuments({
              rentACarId,
            }); // Get the total number of posts for the user
            const totalPages = Math.ceil(totalVehicle / requestsPerPage); // Calculate the total number of pages
      
            const skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page
      
            const requests = await vehicleRequest.find({ rentACarId })
              .skip(skip)
              .limit(requestsPerPage);
            let previousPage = page > 1 ? page - 1 : null;
            let nextPage = page < totalPages ? page + 1 : null;
            return res.status(200).json({
              requests: requests,
              auth: true,
              previousPage: previousPage,
              nextPage: nextPage,
            });
          } catch (error) {
            return next(error);
          }
      },
      async addRequests(req,res,next){
        const {vehicleId, rentACarId, userId, userName, vehicleModel} = req.body;
        rentACarId = req.user._id;
        const request = new vehicleRequest({
          vehicleId,
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
        const requestId = req.user._id;
        const requests = await vehicleRequest.find({ requestId , status: "pending"});
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
      const requestId = req.query.requestId;
      const requests = await vehicleRequest.findById(requestId);
      if (!requests) {
        const error = new Error("Request for Vehicle not found!");
        error.status = 404;
        return next(error);
      }
      
      requests.status = "accept";
      await requests.save();

      // accepted Requests

      const onRequest = new acceptedRequests({
        rentACarId: requests.rentACarId,
        userId: requests.userId,
        userName: requests.userName,
        vehicleModel:requests.vehicleModel,
      });
      await onRequest.save();
      return res.status(200).json({
        auth: true,
        message: "Request for Vehicle Accepted Successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
  async rejectRequest(req, res, next) {
    try {
        const requestId = req.query.requestId;
        const requests = await vehicleRequest.findById(requestId);
        if (!requests) {
        const error = new Error(" Request for Vehicle not found!");
        error.status = 404;
        return next(error);
      }
      await vehicleRequest.findByIdAndDelete(requestId);
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