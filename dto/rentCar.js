class rentCarDTO {
    constructor(rentCar) {
      this._id = rentCar._id;
      this.email = rentCar.email;
      this.phoneNumber = rentCar.phoneNumber;
      this.password = rentCar.password;
      this.ownerName = rentCar.ownerName;
      this.fatherName = rentCar.fatherName;
      this.cnicOrPassportNo = rentCar.cnicOrPassportNo;
      this.expiryDate = rentCar.expiryDate;
      this.companyName = rentCar.companyName;
      this.companyLastName = rentCar.companyLastName;
      this.licenseNo = rentCar.licenseNo;
      this.licenseExpiry = rentCar.licenseExpiry;
      this.companyAddress = rentCar.companyAddress;
      this.companyExperiences = rentCar.companyExperiences;
      this.emergencyNo = rentCar.emergencyNo;
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
      this.ownerImage = rentCar.ownerImage;
      this.cnicImage = rentCar.cnicImage;
      this.taxFileImage = rentCar.taxFileImage;
    }
  }
  module.exports = rentCarDTO;
