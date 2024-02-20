class doctorDTO {
  constructor(doc) {
    this._id = doc._id;
    this.email = doc.email;
    this.phoneNumber = doc.phoneNumber;
    this.password = doc.password;
    this.name = doc.name;
    this.cnicOrPassportNo = doc.cnicOrPassportNo;
    this.qualification = doc.qualification;
    this.speciality = doc.speciality;
    this.loc = doc.loc;
    this.services = doc.services;
    this.clinicName = doc.clinicName;
    this.clinicAddress = doc.clinicAddress;
    this.clinicExperiences = doc.clinicExperiences;
    this.pmdcNumber = doc.pmdcNumber;
    this.emergencyNo = doc.emergencyNo;
    this.state = doc.state;
    this.country = doc.country;
    this.website = doc.website;
    this.twitter = doc.twitter;
    this.facebook = doc.facebook;
    this.instagram = doc.instagram;
    this.incomeTaxNo = doc.incomeTaxNo;
    this.salesTaxNo = doc.salesTaxNo;
    this.bankName = doc.bankName;
    this.accountHolderName = doc.accountHolderName;
    this.accountNumber = doc.accountNumber;
    this.doctorImage = doc.doctorImage;
    this.cnicImage = doc.cnicImage;
    this.clinicLogo = doc.clinicLogo;
    this.pmdcImage = doc.pmdcImage;
    this.taxFileImage = doc.taxFileImage;
    this.averageRating = doc.averageRating;
  }
}
module.exports = doctorDTO;
