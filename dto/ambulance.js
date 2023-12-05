class ambulanceDTO {
    constructor(ambulance) {
      this._id = ambulance._id;
      this.companyName = ambulance.companyName;
      this.companyDetail = ambulance.companyDetail;
      this.authorizedName = ambulance.authorizedName;
      this.authorizedDetail = ambulance.authorizedDetail;
      this.authorizedCnic = ambulance.authorizedCnic;
      this.qualification = ambulance.qualification;
      this.emergencyContact = ambulance.emergencyContact;
      this.registrationNumber = ambulance.registrationNumber;
      this.cellNo = ambulance.cellNo;
      this.ambulanceEquipDetail = ambulance.ambulanceEquipDetail;
      this.state = ambulance.state;
      this.country = ambulance.country;
      this.website = ambulance.email;
      this.twitter = ambulance.twitter;
      this.facebook = ambulance.facebook;
      this.instagram = ambulance.instagram;
      this.incomeTaxNo = ambulance.incomeTaxNo;
      this.salesTaxNo = ambulance.salesTaxNo;
      this.bankName = ambulance.bankName;
      this.accountHolderName = ambulance.accountHolderName;
      this.accountNumber = ambulance.accountNumber;
      this.cnicImage = ambulance.cnicImage;
      this.taxFileImage = ambulance.taxFileImage;
    }
  }
  module.exports = ambulanceDTO;
