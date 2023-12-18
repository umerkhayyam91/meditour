class physioDTO {
    constructor(physio) {
      this._id = physio._id;
      this.email = physio.email;
      this.phoneNumber = physio.phoneNumber;
      this.password = physio.password;
      this.name = physio.name;
      this.fatherOrHusbandName = physio.fatherOrHusbandName;
      // this.gender = physio.gender;
      // this.DOB = physio.DOB;
      this.cnicOrPassNo = physio.cnicOrPassNo;
      this.expiryDate = physio.expiryDate;
      this.qualification = physio.qualification;
      this.speciality = physio.speciality;
      this.services = physio.services;
      this.clinicName = physio.clinicName;
      this.clinicLastName = physio.clinicLastName;
      this.pmdcNumber = physio.pmdcNumber;
      // this.clinicLicense = physio.clinicLicense;
      this.licenceExpiryDate = physio.licenceExpiryDate;
      this.emergencyNo = physio.emergencyNo;
      this.clinicAddress = physio.clinicAddress;
      this.clinicExperiences = physio.clinicExperiences;
      this.state = physio.state;
      this.country = physio.country;
      this.website = physio.website;
      this.twitter = physio.twitter;
      this.youtube = physio.youtube;
      this.instagram = physio.instagram;
      this.incomeTaxNo = physio.incomeTaxNo;
      this.salesTaxNo = physio.salesTaxNo;
      this.bankName = physio.bankName;
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
