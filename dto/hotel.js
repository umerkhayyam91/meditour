class travelAgencyDTO {
    constructor(agency) {
      this._id = agency._id;
      this.email = agency.email;
      this.phoneNumber = agency.phoneNumber;
      this.password = agency.password;
      this.hotelName = agency.hotelName;
      this.hotelLastName = agency.hotelLastName;
      this.licenseNo = agency.licenseNo;
      this.licenceExpiry = agency.licenceExpiry;
      this.ownerName = agency.ownerName;
      this.fatherName = agency.fatherName;
      this.cnicOrPassportNo = agency.cnicOrPassportNo;
      this.expiryDate = agency.expiryDate;
      this.hotelAddress = agency.hotelAddress;
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
