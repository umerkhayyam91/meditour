class travelAgencyDTO {
    constructor(agency) {
      this._id = agency._id;
      this.email = agency.email;
      this.phoneNumber = agency.phoneNumber;
      this.password = agency.password;
      this.companyFirstName = agency.companyFirstName;
      this.companyLastName = agency.companyLastName;
      this.companyLicenseNo = agency.companyLicenseNo;
      this.licenceExpiry = agency.licenceExpiry;
      this.ownerFirstName = agency.ownerFirstName;
      this.ownerLastName = agency.ownerLastName;
      this.cnicOrPassportNo = agency.cnicOrPassportNo;
      this.expiryDate = agency.expiryDate;
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
      this.ownerImage = agency.ownerImage;
      this.cnicImage = agency.cnicImage;
      this.taxFileImage = agency.taxFileImage;
    }
  }
  module.exports = travelAgencyDTO;
