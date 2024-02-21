const express = require("express");
const app = express();
const Hotel = require("../../models/Hotel/hotel.js");
const BNB = require("../../models/Hotel/bnbInfo.js");
const Joi = require("joi");

const bnbRoomController = {
  async addRoom(req, res, next) {
    try {
      const roomRegisterSchema = Joi.object({
        roomType: Joi.string().required(),
        roomName: Joi.string().required(),
        smokingPolicy: Joi.string().required(),
        noOfRooms: Joi.string().required(),
        bedKinds: Joi.string().required(),
        noOfBeds: Joi.string().required(),
        registrationNo: Joi.string().required(),
        registrationDate: Joi.string().required(),
        noOfGuestsStay: Joi.string().required(),
        pricePerNight: Joi.string().required(),
        priceForMeditour: Joi.string().required(),
        roomImages: Joi.string().required(),
        roomDescription: Joi.string().required(),
      });

      const { error } = roomRegisterSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      const {
        roomType,
        roomName,
        smokingPolicy,
        noOfRooms,
        bedKinds,
        noOfBeds,
        registrationNo,
        registrationDate,
        noOfGuestsStay,
        pricePerNight,
        priceForMeditour,
        roomImages,
        roomDescription,
      } = req.body;
      const bnbId = req.query.bnbId;
      const bnb = await BNB.findById(bnbId);

      const newRoom = {
        roomType,
        roomName,
        smokingPolicy,
        noOfRooms,
        bedKinds,
        noOfBeds,
        registrationNo,
        registrationDate,
        noOfGuestsStay,
        pricePerNight,
        priceForMeditour,
        roomImages,
        roomDescription,
      };

      // Add the new room to the BNB's rooms array
      bnb.rooms.push(newRoom);

      updatedbnb = await bnb.save();
      return res.status(201).json({ bnb: updatedbnb, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async editRoom(req, res, next) {
    const roomSchema = Joi.object({
      roomType: Joi.string(),
      roomName: Joi.string(),
      smokingPolicy: Joi.string(),
      noOfRooms: Joi.string(),
      bedKinds: Joi.string(),
      noOfBeds: Joi.string(),
      registrationNo: Joi.string(),
      registrationDate: Joi.string(),
      noOfGuestsStay: Joi.string(),
      pricePerNight: Joi.string(),
      priceForMeditour: Joi.string(),
      roomImages: Joi.string(),
      roomDescription: Joi.string(),
    });
  
    const { error } = roomSchema.validate(req.body);
  
    if (error) {
      return next(error);
    }
  
    const { roomId } = req.query;
  
    try {
      const result = await BNB.updateOne(
        { "rooms._id": roomId },
        {
          $set: {
            "rooms.$.roomType": req.body.roomType,
            "rooms.$.roomName": req.body.roomName,
            "rooms.$.smokingPolicy": req.body.smokingPolicy,
            "rooms.$.noOfRooms": req.body.noOfRooms,
            "rooms.$.bedKinds": req.body.bedKinds,
            "rooms.$.noOfBeds": req.body.noOfBeds,
            "rooms.$.registrationNo": req.body.registrationNo,
            "rooms.$.registrationDate": req.body.registrationDate,
            "rooms.$.noOfGuestsStay": req.body.noOfGuestsStay,
            "rooms.$.pricePerNight": req.body.pricePerNight,
            "rooms.$.priceForMeditour": req.body.priceForMeditour,
            "rooms.$.roomImages": req.body.roomImages,
            "rooms.$.roomDescription": req.body.roomDescription,
          },
        }
      );
  
      if (result.nModified === 0) {
        // If nModified is 0, it means the room with the specified ID was not found
        const error = new Error("Room not found!");
        error.status = 404;
        return next(error);
      }
  
      return res.status(200).json({
        message: "Room updated successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async deleteRoom(req, res, next) {
    const roomId = req.query.roomId;
    const bnbId = req.query.bnbId;
    try {
      const updatedBnb = await BNB.updateOne(
        { _id: bnbId },
        { $pull: { rooms: { _id: roomId } } }
      );
    
      if (updatedBnb.nModified === 0) {
        const error = new Error("Room not found in BNB!");
        error.status = 404;
        return next(error);
      }
    
      return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  async getRoom(req, res, next) {
    try {
      const roomId = req.query.roomId;
      const room = await BNB.findOne({ "rooms._id": roomId }, { "rooms.$": 1 });

      if (!room) {
        const error = new Error("Room not found!");
        error.status = 404;
        return next(error);
      }
      const innerRoom = room.rooms[0];
      return res.status(200).json({ room: innerRoom });
    } catch (error) {
      return next(error);
    }
  },

  async getAllRoom(req, res, next) {
    try {
      // const bnbId
      const bnbId = req.query.bnbId;
      const bnb = await BNB.findById(bnbId);
      const rooms = bnb.rooms;
      return res.status(200).json({ rooms });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = bnbRoomController;
