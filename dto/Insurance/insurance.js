class insuranceDTO {
    constructor(insurance) {
      this._id = insurance._id;
      this.email = insurance.email;
      this.phoneNumber = insurance.phoneNumber;
      this.password = insurance.password;
      this.companyName = insurance.companyName;
      this.companyLicenseNo = insurance.companyLicenseNo;
      this.companyEmergencyNo = insurance.companyEmergencyNo;
      this.ownerName = insurance.ownerName;
      this.cnicOrPassportNo = insurance.cnicOrPassportNo;
      this.companyAddress = insurance.companyAddress;
      this.state = insurance.state;
      this.country = insurance.country;
      this.website = insurance.website;
      this.twitter = insurance.twitter;
      this.facebook = insurance.facebook;
      this.instagram = insurance.instagram;
      this.incomeTaxNo = insurance.incomeTaxNo;
      this.salesTaxNo = insurance.salesTaxNo;
      this.bankName = insurance.bankName;
      this.accountHolderName = insurance.accountHolderName;
      this.accountNumber = insurance.accountNumber;
      this.companyLogo = insurance.companyLogo;
      this.licenseImage = insurance.licenseImage;
      this.cnicImage = insurance.cnicImage;
      this.taxFileImage = insurance.taxFileImage;
    }
  }
  module.exports = insuranceDTO;
