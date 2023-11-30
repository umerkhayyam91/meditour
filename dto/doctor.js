class PharmDTO {
    constructor(pharm) {
      this._id = pharm._id;
      this.name = pharm.name;
      this.fatherName = pharm.fatherName;
      this.DOB = pharm.DOB;
      this.cnicOrPassNo = pharm.cnicOrPassNo;
      this.qualification = pharm.qualification;
      this.speciality = pharm.speciality;
      this.clinicName = pharm.clinicName;
      this.clinicLicense = pharm.clinicLicense;
      this.licenceExpiryDate = pharm.licenceExpiryDate;
      this.clinicAddress = pharm.clinicAddress;
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
      this.doctorImage = pharm.doctorImage;
      this.cnicImage = pharm.cnicImage;
      this.taxFileImage = pharm.taxFileImage;
    }
  }
  module.exports = PharmDTO;
