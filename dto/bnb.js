class bnbDTO{
    constructor(bnb){
        this._id = bnb._id;
        this.propertyName= bnb.propertyName;
        this.starRating= bnb.starRating;
        this.customName= bnb.customName;
        this.contactNumber= bnb.contactNumber;
        this.alternativeContactNo= bnb.alternativeContactNo;
        this.province= bnb.province;
        this.propertyAddress= bnb.propertyAddress;
        this.zipCode=bnb.zipCode;
        this.country= bnb.country; 
        this.roomType= bnb.roomType;
        this.roomName=bnb.roomName;
        this.smokingPolicy=bnb.smokingPolicy;
        this.noOfAllRooms=bnb.noOfAllRooms;
        this.bedKinds=bnb.bedKinds;
        this.bedNo=bnb.bedNo;
        this.guestNo=bnb.guestNo;
        this.roomSize=bnb.roomSize;
        this.pricePerNight=bnb.pricePerNight;
        this.priceForMeditour=bnb.priceForMeditour;
        this.parkingAvailability=bnb.parkingAvailability;
        this.parkingPrice=bnb.parkingPrice;
        this.language=bnb.language;
        this.facillities=bnb.facillities;
        this.extraBed=bnb.extraBed;
        this.addExtraBed=bnb.addExtraBed;
        this.guestsInExtraBeds=bnb.guestsInExtraBeds;
        this.amenities=bnb.amenities;
        this.propertyphoto=bnb.propertyphoto;
        this.advanceCancelfreeofCharge=bnb.advanceCancelfreeofCharge;
        this.checkInForm=bnb.checkInForm;
        this.checkOutForm=bnb.checkOutForm;
        this.accomodateChildren=bnb.accomodateChildren;
        this.pets=bnb.pets;
        this.chargesOfPets=bnb.chargesOfPets;
        this.addAnotherProperty=bnb.addAnotherProperty;
       
    }
}
module.exports = bnbDTO;
