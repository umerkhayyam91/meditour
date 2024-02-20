class physioDTO {
  constructor(physio) {
    this._id = physio._id;
    this.email = physio.email;
    this.phoneNumber = physio.phoneNumber;
    this.password = physio.password;
    this.name = physio.name;
    this.loc = physio.loc;
    this.cnicOrPassNo = physio.cnicOrPassNo;
    this.qualification = physio.qualification;
    this.speciality = physio.speciality;
    this.services = physio.services;
    this.clinicExperiences = physio.clinicExperiences;
    this.clinicName = physio.clinicName;
    this.pmdcNumber = physio.pmdcNumber;
    this.emergencyNo = physio.emergencyNo;
    this.clinicAddress = physio.clinicAddress;
    this.state = physio.state;
    this.country = physio.country;
    this.website = physio.website;
    this.twitter = physio.twitter;
    this.youtube = physio.youtube;
    this.instagram = physio.instagram;
    this.incomeTaxNo = physio.incomeTaxNo;
    this.salesTaxNo = physio.salesTaxNo;
    this.bankName = physio.bankName;
    this.averageRating = doc.averageRating;
    this.accountHolderName = physio.accountHolderName;
    this.accountNumber = physio.accountNumber;
    this.physioImage = physio.physioImage;
    this.cnicImage = physio.cnicImage;
    this.clinicLogo = physio.clinicLogo;
    this.pmdcImage = physio.pmdcImage;
    this.taxFileImage = physio.taxFileImage;
  }
}
module.exports = physioDTO;
