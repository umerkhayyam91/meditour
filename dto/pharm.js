class PharmDTO {
  constructor(pharm) {
    this._id = pharm._id;
    this.email = pharm.email;
    this.phoneNumber = pharm.phoneNumber;
    this.password = pharm.password;
    this.pharmacyFirstName = pharm.pharmacyFirstName;
    this.pharmacyLastName = pharm.pharmacyLastName;
    this.pharmacyLicenseNumber = pharm.pharmacyLicenseNumber;
    this.OwnerName = pharm.OwnerName;
    this.cnicOrPassportNo = pharm.cnicOrPassportNo;
    this.pharmacyAddress = pharm.pharmacyAddress;
    this.emergencyNo = pharm.emergencyNo;
    this.state = pharm.state;
    this.country = pharm.country;
    this.website = pharm.website;
    this.twitter = pharm.twitter;
    this.facebook = pharm.facebook;
    this.instagram = pharm.instagram;
    this.incomeTaxNo = pharm.incomeTaxNo;
    this.salesTaxNo = pharm.salesTaxNo;
    this.bankName = pharm.bankName;
    this.accountHolderName = pharm.accountHolderName;
    this.accountNumber = pharm.accountNumber;
    this.pharmacyLogo = pharm.pharmacyLogo;
    this.pharmacyLicenseImage = pharm.pharmacyLicenseImage;
    this.cnicImage = pharm.cnicImage;
    this.taxFileImage = pharm.taxFileImage;
    this.averageRating = pharm.averageRating;
  }
}
module.exports = PharmDTO;
