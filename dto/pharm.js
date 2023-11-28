class PharmDTO {
    constructor(pharm) {
      this._id = pharm._id;
      this.pharmFirstName = pharm.pharmFirstName;
      this.pharmMiddleName = pharm.pharmMiddleName;
      this.pharmLastName = pharm.pharmLastName;
      this.pharmLicenseNumber = pharm.pharmLicenseNumber;
      this.licenceExpiryDate = pharm.licenceExpiryDate;
      this.OwnerFirstName = pharm.OwnerFirstName;
      this.OwnerMiddleName = pharm.OwnerMiddleName;
      this.OwnerLastName = pharm.OwnerLastName;
      this.cnicOrPassportNo = pharm.cnicOrPassportNo;
      this.cnicOrPassportExpiry = pharm.cnicOrPassportExpiry;
      this.pharmAddress = pharm.pharmAddress;
      this.state = pharm.state;
      this.country = pharm.country;
      this.website = pharm.email;
      this.twitter = pharm.twitter;
      this.facebook = pharm.facebook;
      this.instagram = pharm.instagram;
      this.incomeTaxNo = pharm.incomeTaxNo;
      this.salesTaxNo = pharm.salesTaxNo;
      this.bankName = pharm.bankName;
      this.accountHolderName = pharm.accountHolderName;
      this.accountNumber = pharm.accountNumber;
      this.pharmImage = pharm.pharmImage;
      this.ownerImage = pharm.ownerImage;
      this.taxFileImage = pharm.taxFileImage;
      this.taxExemptImage = pharm.taxExemptImage;
    }
  }
  module.exports = PharmDTO;
