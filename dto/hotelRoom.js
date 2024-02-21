class roomDTO {
    constructor(room) {
      this.roomType = room.roomType;
      this.roomName = room.roomName;
      this.smokingPolicy = room.smokingPolicy;
      this.noOfAllRooms = room.noOfAllRooms;
      this.bedKinds = room.bedKinds;
      this.bedNo = room.bedNo;
      this.guestNo = room.guestNo;
      this.roomSize = room.roomSize;
      this.pricePerNight = room.pricePerNight;
      this.priceForMeditour = room.priceForMeditour;
    }
  }
  module.exports = roomDTO;
  