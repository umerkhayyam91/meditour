class doctorDTO {
    constructor(doc) {
      this._id = doc._id;
      this.email = doc.email;
      this.phoneNumber = doc.phoneNumber;
      this.password = doc.password;
      this.name = doc.name;
      this.fatherName = doc.fatherName;
      this.DOB = doc.DOB;
      this.cnicOrPassNo = doc.cnicOrPassNo;
      this.qualification = doc.qualification;
      this.speciality = doc.speciality;
      this.services = doc.services;
      this.clinicName = doc.clinicName;
      this.clinicLicense = doc.clinicLicense;
      this.licenceExpiryDate = doc.licenceExpiryDate;
      this.availability = doc.availability;
      this.time = doc.time;
      this.videoConsultFee = doc.videoConsultFee;
      this.onClinicFee = doc.onClinicFee;
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
