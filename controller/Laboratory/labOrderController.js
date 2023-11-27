const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../../models/Laboratory/order.js");
const orderDto = require("../../dto/order.js");

const labOrderController = {
    async getOrders(req, res) {
        try {
          const allOrders = await Order.find();
          const OrderDto = new orderDto(allOrders);
          return res.status(200).json({ orders: OrderDto, auth: true });
        } catch (error) {
          res.status(500).json({
            status: "Failure",
            error: error.message,
          });
        }
      },
    
      async changeStatus(req, res, next) {
        try {
          const newStatus = req.body.status;
          if (!newStatus) {
            const error = {
              status: 401,
              message: "Status not found",
            };
    
            return next(error);
          }
          const id = req.query.id;
          const result = await Laboratory.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: { labFirstName: newStatus } },
            { returnDocument: "after" } // Optional: Specify 'after' to return the updated document
          );
          console.log(result)
          if (!result) {
            const error = {
              status: 401,
              message: "Order not found",
            };
    
            return next(error);
          }
          res.status(200).json({
            auth: true,
            message: "status changed successfully",
          });
        } catch (error) {
          return next(error);
        }
      },
}

module.exports = labOrderController;