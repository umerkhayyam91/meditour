class roomDTO {
    constructor(room) {
      this.roomType = room.roomType;
      this.roomName = room.roomName;
      this.smokingPolicy = room.smokingPolicy;
      this.noOfAllRooms = room.noOfAllRooms;
      this.bedKinds = room.bedKinds;
      this.noOfBeds = room.noOfBeds;
      this.registrationNo = room.registrationNo;
      this.registrationDate = room.registrationDate;
      this.noOfGuestsStay = room.noOfGuestsStay;
      this.pricePerNight = room.pricePerNight;
      this.priceForMeditour = room.priceForMeditour;
      this.roomImages = room.roomImages;
      this.roomDescription = room.roomDescription;
    }
  }
  module.exports = roomDTO;
  