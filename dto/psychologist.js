class doctorDTO {
    constructor(doc) {
      this._id = doc._id;
      this.email = doc.email;
      this.phoneNumber = doc.phoneNumber;
      this.password = doc.password;
      this.name = doc.name;
      this.fatherName = doc.fatherName;
      this.gender = doc.gender;
      this.cnicOrPassportNo = doc.cnicOrPassportNo;
      this.cnicOrPassportExpiry = doc.cnicOrPassportExpiry;
      this.qualification = doc.qualification;
      this.speciality = doc.speciality;
      this.services = doc.services;
      this.clinicFirstName = doc.clinicFirstName;
      this.clinicLastName = doc.clinicLastName;
      this.clinicExperiences = doc.clinicExperiences;
      this.pmdcLiscenceNo = doc.pmdcLiscenceNo;
      this.pmdcExpiryDate = doc.pmdcExpiryDate;
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
      this.clinicLogo = doc.clinicLogo;
      this.pmdcImage = doc.pmdcImage;
      this.taxFileImage = doc.taxFileImage;
    }
  }
  module.exports = doctorDTO;
  