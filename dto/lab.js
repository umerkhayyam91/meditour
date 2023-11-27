class LabDTO {
  constructor(lab) {
    this._id = lab._id;
    this.labFirstName = lab.labFirstName;
    this.labLastName = lab.labLastName;
    this.labLicenseNumber = lab.labLicenseNumber;
    this.labExpiryDate = lab.labExpiryDate;
    this.OwnerFirstName = lab.OwnerFirstName;
    this.OwnerMiddleName = lab.OwnerMiddleName;
    this.OwnerLastName = lab.OwnerLastName;
    this.cnicOrPassportNo = lab.cnicOrPassportNo;
    this.cnicOrPassportExpiry = lab.cnicOrPassportExpiry;
    this.labAddress = lab.labAddress;
    this.state = lab.state;
    this.country = lab.country;
    this.website = lab.email;
    this.twitter = lab.twitter;
    this.facebook = lab.facebook;
    this.instagram = lab.instagram;
    this.incomeTaxNo = lab.incomeTaxNo;
    this.salesTaxNo = lab.salesTaxNo;
    this.bankName = lab.bankName;
    this.accountHolderName = lab.accountHolderName;
    this.accountName = lab.accountName;
    this.labLogo = lab.labLogo;
    this.labLicenseImage = lab.labLicenseImage;
    this.taxFileImage = lab.taxFileImage;
    this.cnicImage = lab.cnicImage;
  }
}

module.exports = LabDTO;
