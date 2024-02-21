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
        noOfGuestsStay: Joi.string().required(),
        roomSize: Joi.string().required(),
        pricePerNight: Joi.string().required(),
        priceForMeditour: Joi.string().required(),
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
        noOfGuestsStay,
        roomSize,
        pricePerNight,
        priceForMeditour,
      } = req.body;
      const bnbId = req.query.bnbId;

      let room;
      try {
        const roomToRegister = new Room({
          bnbId,
          roomType,
          roomName,
          smokingPolicy,
          noOfRooms,
          bedKinds,
          noOfBeds,
          noOfGuestsStay,
          roomSize,
          pricePerNight,
          priceForMeditour,
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
      noOfGuestsStay: Joi.string(),
      roomSize: Joi.string(),
      pricePerNight: Joi.string(),
      priceForMeditour: Joi.string(),
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
      noOfGuestsStay,
      roomSize,
      pricePerNight,
      priceForMeditour,
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
    if (noOfGuestsStay) existingRoom.noOfGuestsStay = noOfGuestsStay;
    if (roomSize) existingRoom.roomSize = roomSize;
    if (pricePerNight) existingRoom.pricePerNight = pricePerNight;
    if (priceForMeditour) existingRoom.priceForMeditour = priceForMeditour;

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
};

module.exports = bnbRoomController;
