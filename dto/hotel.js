class hotelDTO {
    constructor(hotel) {
      this._id = hotel._id;
      this.email = hotel.email;
      this.phoneNumber = hotel.phoneNumber;
      this.password = hotel.password;
      this.companyName = hotel.companyName;
      this.companyLicenseNo = hotel.companyLicenseNo;
      this.companyEmergencyNo = hotel.companyEmergencyNo;
      this.ownerName = hotel.ownerName;
      this.cnicOrPassportNo = hotel.cnicOrPassportNo;
      this.companyAddress = hotel.companyAddress;
      this.state = hotel.state;
      this.country = hotel.country;
      this.website = hotel.website;
      this.twitter = hotel.twitter;
      this.facebook = hotel.facebook;
      this.instagram = hotel.instagram;
      this.incomeTaxNo = hotel.incomeTaxNo;
      this.salesTaxNo = hotel.salesTaxNo;
      this.bankName = hotel.bankName;
      this.accountHolderName = hotel.accountHolderName;
      this.accountNumber = hotel.accountNumber;
      this.companyLogo = hotel.companyLogo;
      this.licenseImage = hotel.licenseImage;
      this.cnicImage = hotel.cnicImage;
      this.taxFileImage = hotel.taxFileImage;
      this.fcmToken = hotel.fcmToken;
    }
  }
  module.exports = hotelDTO;
