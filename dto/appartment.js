class appartmentDTO{
    constructor(appartment){
        this._id = appartment._id;
        this.propertyName= appartment.propertyName;
        this.starRating= appartment.starRating;
        this.customName= appartment.propertyName;
        this.contactNumber= appartment.contactNumber;
        this.streetAddress= appartment.streetAddress;
        this.addressLine2= appartment.addressLine2;
        this.city= appartment.city;
        this.postCode=appartment.postCode;
        this.country= appartment.country; 
        this.propertyOwnership= appartment.propertyOwnership;
        this.channelManager=appartment.channelManager;
        this.nameOfCompany=appartment.nameOfCompany;
        this.nameOfManager=appartment.nameOfManager;
        this.numberOfBedroom=appartment.numberOfBedroom;
        this.numberOfLivingroom=appartment.numberOfLivingroom;
        this.numberOfBathroom=appartment.numberOfBathroom;
        this. numberOfAppartments=appartment.numberOfAppartments;
        this.TypeOfAppartments=appartment.TypeOfAppartments;
        this.KindOfBeds=appartment.KindOfBeds;
        this.numberOfBed=appartment.KindOfBeds;
        this.addAnotherBed=appartment.addAnotherBed;
        this.noOfStayingGuests=appartment.noOfStayingGuests;
        this.privateBathroom=appartment.privateBathroom;
        this.numberOfsofaBedSofaBed=appartment.numberOfSofaBed;
        this.guest=appartment.guest;
        this.appartmentSize=appartment.appartmentSize;
        this.basePricePerNight=appartment.basePricePerNight;
        this.isParkingAvailable=appartment.isParkingAvailable;
        this.parkingtype=appartment.parkingtype;
        this.siteParking=appartment.siteParking;
        this.reservation=appartment.reservation;
        this.priceOfParking=appartment.priceOfParking;
        this.breakfast=appartment.breakfast;
        this.priceOfBreakfast=appartment.priceOfBreakfast;
        this.kindOfBreakfast=appartment.kindOfBreakfast;
        this.language=appartment.language;
        this.facillities=appartment.facillities;
        this.extraBed=appartment.extraBed;
        this.selectedNumberOfBed=appartment.selectedNumberOfBed;
        this.extraBedAccomodateGuest=appartment.extraBedAccomodateGuest;
        this.Amenities=appartment.Amenities;
        this.propertyphoto=appartment.propertyphoto;
        this.advanceCancelfreeofCharge=appartment.advanceCancelfreeofCharge;
        this.CheckInForm=appartment.CheckInForm;
        this.CheckOutForm=appartment.CheckOutForm;
        this.smoking=appartment.smoking;
        this.AccomodateChildren=appartment.AccomodateChildren;
        this.minimumStay=appartment.minimumStay;
        this.pets=appartment.pets;
        this.chargesOfPets=appartment.chargesOfPets;
        
    }
}
module.exports = appartmentDTO;
