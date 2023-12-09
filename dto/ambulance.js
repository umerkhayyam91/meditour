class ambulanceDTO {
    constructor(ambulance) {
      this._id = ambulance._id;
      this.ambulanceCompanyId = ambulance.ambulanceCompanyId;
      this.vehicleType = ambulance.vehicleType;
      this.vehicleName = ambulance.vehicleName;
      this.vehicleModel = ambulance.vehicleModel;
      this.vehicleYear = ambulance.vehicleYear;
      this.vehicleColor = ambulance.vehicleColor;
      this.vehicleFacilities = ambulance.vehicleFacilities;
      this.registrationNo = ambulance.registrationNo;
      this.registrationDate = ambulance.registrationDate;
      this.actualPrice = ambulance.actualPrice;
      this.priceForMeditour = ambulance.priceForMeditour;
    }
  }
  module.exports = ambulanceDTO;
