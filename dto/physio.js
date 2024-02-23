class physioDTO {
  constructor(doc) {
    this._id = doc._id;
    this.email = doc.email;
    this.phoneNumber = doc.phoneNumber;
    this.password = doc.password;
    this.name = doc.name;
    this.loc = doc.loc;
    this.cnicOrPassNo = doc.cnicOrPassNo;
    this.qualification = doc.qualification;
    this.speciality = doc.speciality;
    this.services = doc.services;
    this.clinicExperiences = doc.clinicExperiences;
    this.clinicName = doc.clinicName;
    this.pmdcNumber = doc.pmdcNumber;
    this.emergencyNo = doc.emergencyNo;
    this.clinicAddress = doc.clinicAddress;
    this.state = doc.state;
    this.country = doc.country;
    this.website = doc.website;
    this.twitter = doc.twitter;
    this.youtube = doc.youtube;
    this.instagram = doc.instagram;
    this.incomeTaxNo = doc.incomeTaxNo;
    this.salesTaxNo = doc.salesTaxNo;
    this.bankName = doc.bankName;
    this.averageRating = doc.averageRating;
    this.accountHolderName = doc.accountHolderName;
    this.accountNumber = doc.accountNumber;
    this.physioImage = doc.physioImage;
    this.cnicImage = doc.cnicImage;
    this.clinicLogo = doc.clinicLogo;
    this.pmdcImage = doc.pmdcImage;
    this.taxFileImage = doc.taxFileImage;
    this.fcmToken = doc.fcmToken;
  }
}
module.exports = physioDTO;
