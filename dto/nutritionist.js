class doctorDTO {
  constructor(doc) {
    this._id = doc._id;
    this.email = doc.email;
    this.phoneNumber = doc.phoneNumber;
    this.password = doc.password;
    this.name = doc.name;
    // this.fatherName = doc.fatherName;
    // this.DOB = doc.DOB;
    // this.gender = doc.gender;
    this.cnicOrPassportNo = doc.cnicOrPassportNo;
    this.qualification = doc.qualification;
    this.speciality = doc.speciality;
    this.services = doc.services;
    this.clinicName = doc.clinicName;
    this.pmdcNumber = doc.pmdcNumber;
    this.clinicExperiences = doc.clinicExperiences;
    this.emergencyNo = doc.emergencyNo;
    this.clinicAddress = doc.clinicAddress;
    this.state = doc.state;
    this.country = doc.country;
    this.website = doc.website;
    this.twitter = doc.twitter;
    this.facebook = doc.facebook;
    this.instagram = doc.instagram;
    this.incomeTaxNo = doc.incomeTaxNo;
    this.salesTaxNo = doc.salesTaxNo;
    this.averageRating = doc.averageRating;
    this.bankName = doc.bankName;
    this.loc = doc.loc;
    this.accountHolderName = doc.accountHolderName;
    this.accountNumber = doc.accountNumber;
    this.doctorImage = doc.doctorImage;
    this.cnicImage = doc.cnicImage;
    this.clinicLogo = doc.clinicLogo;
    this.pmdcImage = doc.pmdcImage;
    this.taxFileImage = doc.taxFileImage;
    this.fcmToken = doc.fcmToken;
  }
}
module.exports = doctorDTO;
