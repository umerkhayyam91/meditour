class doctorDTO {
  constructor(doc) {
    this._id = doc._id;
    this.email = doc.email;
    this.phoneNumber = doc.phoneNumber;
    this.password = doc.password;
    this.name = doc.name;
    this.fatherName = doc.fatherName;
    this.DOB = doc.DOB;
    this.gender = doc.gender;
    this.cnicOrPassportNo = doc.cnicOrPassportNo;
    this.qualification = doc.qualification;
    this.speciality = doc.speciality;
    this.services = doc.services;
    this.clinicName = doc.clinicName;
    this.clinicLastName = doc.clinicLastName;
    this.clinicLiscenceNo = doc.clinicLiscenceNo;
    this.licenceExpiryDate = doc.licenceExpiryDate;
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
    this.bankName = doc.bankName;
    this.accountHolderName = doc.accountHolderName;
    this.accountNumber = doc.accountNumber;
    this.doctorImage = doc.doctorImage;
    this.cnicImage = doc.cnicImage;
    this.taxFileImage = doc.taxFileImage;
  }
}
module.exports = doctorDTO;
