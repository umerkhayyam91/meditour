class rentCarDTO {
    constructor(rentCar) {
      this._id = rentCar._id;
      this.email = rentCar.email;
      this.phoneNumber = rentCar.phoneNumber;
      this.password = rentCar.password;
      this.companyName = rentCar.companyName;
      this.companyLicenseNo = rentCar.companyLicenseNo;
      this.companyEmergencyNo = rentCar.companyEmergencyNo;
      this.ownerName = rentCar.ownerName;
      this.cnicOrPassportNo = rentCar.cnicOrPassportNo;
      this.companyAddress = rentCar.companyAddress;
      this.loc = rentCar.loc;
      this.state = rentCar.state;
      this.country = rentCar.country;
      this.website = rentCar.website;
      this.twitter = rentCar.twitter;
      this.facebook = rentCar.facebook;
      this.instagram = rentCar.instagram;
      this.incomeTaxNo = rentCar.incomeTaxNo;
      this.salesTaxNo = rentCar.salesTaxNo;
      this.bankName = rentCar.bankName;
      this.accountHolderName = rentCar.accountHolderName;
      this.accountNumber = rentCar.accountNumber;
      this.companyLogo = rentCar.companyLogo;
      this.licenseImage = rentCar.licenseImage;
      this.cnicImage = rentCar.cnicImage;
      this.taxFileImage = rentCar.taxFileImage;
      this.averageRating = rentCar.averageRating;
      this.fcmToken = rentCar.fcmToken;
    }
  }
  module.exports = rentCarDTO;
