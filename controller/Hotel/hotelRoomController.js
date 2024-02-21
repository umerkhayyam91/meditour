const express = require("express");
const app = express();
const Hotel = require("../../models/Hotel/hotel.js");
const Room = require("../../models/Hotel/room.js");
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

      let room;
      try {
        const roomToRegister = new Room({
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
        });

        room = await roomToRegister.save();
      } catch (error) {
        return next(error);
      }
      return res.status(201).json({ room, auth: true });
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

    const roomId = req.query.roomId;
    const existingRoom = await Room.findById(roomId);

    if (!existingRoom) {
      const error = new Error("Room not found!");
      error.status = 404;
      return next(error);
    }
    
    if (roomType) existingRoom.roomType = roomType;
    if (roomName) existingRoom.roomName = roomName;
    if (smokingPolicy) existingRoom.smokingPolicy = smokingPolicy;
    if (noOfRooms) existingRoom.noOfRooms = noOfRooms;
    if (bedKinds) existingRoom.bedKinds = bedKinds;
    if (noOfBeds) existingRoom.noOfBeds = noOfBeds;
    if (registrationNo) existingRoom.registrationNo = registrationNo;
    if (registrationDate) existingRoom.registrationDate = registrationDate;
    if (noOfGuestsStay) existingRoom.noOfGuestsStay = noOfGuestsStay;
    if (pricePerNight) existingRoom.pricePerNight = pricePerNight;
    if (priceForMeditour) existingRoom.priceForMeditour = priceForMeditour;
    if (roomImages) existingRoom.roomImages = roomImages;
    if (roomDescription) existingRoom.roomDescription = roomDescription;

    await existingRoom.save();

    return res.status(200).json({
      message: "Room updated successfully",
      room: existingRoom,
    });
  },

  async deleteRoom(req, res, next) {
    const roomId = req.query.roomId;
    const existingRoom = await Room.findById(roomId);

    if (!existingRoom) {
      const error = new Error("Room not found!");
      error.status = 404;
      return next(error);
    }
    await Room.deleteOne({ _id: roomId });
    return res.status(200).json({ message: "Room deleted successfully" });
  },

  async getRoom(req, res, next) {
    try {
      const roomId = req.query.roomId;
      const room = await Room.findById(roomId);

      if (!room) {
        const error = new Error("Room not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ room });
    } catch (error) {
      return next(error);
    }
  },

  async getAllRoom(req, res, next) {
    try {
      // const bnbId
      const room = await Room.findById(roomId);

      if (!room) {
        const error = new Error("Room not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ room });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = bnbRoomController;
