class ambulanceDTO {
    constructor(ambulance) {
      this._id = ambulance._id;
      this.email = ambulance.email;
      this.phoneNumber = ambulance.phoneNumber;
      this.password = ambulance.password;
      this.ambulanceName = ambulance.ambulanceName;
      this.registrationNumber = ambulance.registrationNumber;
      this.ownerName = ambulance.ownerName;
      this.cnicOrPassportNo = ambulance.cnicOrPassportNo;
      this.companyAddress = ambulance.companyAddress;
      this.emergencyNo = ambulance.emergencyNo;
      this.state = ambulance.state;
      this.country = ambulance.country;
      this.website = ambulance.website;
      this.twitter = ambulance.twitter;
      this.facebook = ambulance.facebook;
      this.instagram = ambulance.instagram;
      this.incomeTaxNo = ambulance.incomeTaxNo;
      this.salesTaxNo = ambulance.salesTaxNo;
      this.bankName = ambulance.bankName;
      this.accountHolderName = ambulance.accountHolderName;
      this.accountNumber = ambulance.accountNumber;
      this.ambulanceLogo = ambulance.ambulanceLogo;
      this.registrationImage = ambulance.registrationImage;
      this.cnicOrPassportImage = ambulance.cnicOrPassportImage;
      this.taxFileImage = ambulance.taxFileImage;
    }
  }
  module.exports = ambulanceDTO;
