class travelAgencyDTO {
    constructor(agency) {
      this._id = agency._id;
      this.email = agency.email;
      this.phoneNumber = agency.phoneNumber;
      this.password = agency.password;
      this.companyName = agency.companyName;
      this.companyLicenseNo = agency.companyLicenseNo;
      this.companyEmergencyNo = agency.companyEmergencyNo;
      this.ownerName = agency.ownerName;
      this.cnicOrPassportNo = agency.cnicOrPassportNo;
      this.companyAddress = agency.companyAddress;
      this.state = agency.state;
      this.country = agency.country;
      this.website = agency.website;
      this.twitter = agency.twitter;
      this.facebook = agency.facebook;
      this.instagram = agency.instagram;
      this.incomeTaxNo = agency.incomeTaxNo;
      this.salesTaxNo = agency.salesTaxNo;
      this.bankName = agency.bankName;
      this.accountHolderName = agency.accountHolderName;
      this.accountNumber = agency.accountNumber;
      this.companyLogo = agency.companyLogo;
      this.licenseImage = agency.licenseImage;
      this.cnicImage = agency.cnicImage;
      this.taxFileImage = agency.taxFileImage;
    }
  }
  module.exports = travelAgencyDTO;