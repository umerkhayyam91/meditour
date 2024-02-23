class hospitalDTO {
    constructor(hospital) {
      this._id = hospital._id;
      this.email = hospital.email;
      this.phoneNumber = hospital.phoneNumber;
      this.password = hospital.password;
      this.hospitalName = hospital.hospitalName;
      this.hospitalRegNo = hospital.hospitalRegNo;
      this.emergencyNo = hospital.emergencyNo;
      this.ownerName = hospital.ownerName;
      this.cnicOrPassportNo = hospital.cnicOrPassportNo;
      this.hospitalAddress = hospital.hospitalAddress;
      this.state = hospital.state;
      this.country = hospital.country;
      this.website = hospital.website;
      this.twitter = hospital.twitter;
      this.facebook = hospital.facebook;
      this.instagram = hospital.instagram;
      this.incomeTaxNo = hospital.incomeTaxNo;
      this.salesTaxNo = hospital.salesTaxNo;
      this.bankName = hospital.bankName;
      this.accountHolderName = hospital.accountHolderName;
      this.accountNumber = hospital.accountNumber;
      this.hospitalLogo = hospital.hospitalLogo;
      this.registrationImage = hospital.registrationImage;
      this.taxFileImage = hospital.taxFileImage;
      this.cnicImage = hospital.cnicImage;
      this.fcmToken = hospital.fcmToken;
    }
  }
  
  module.exports = hospitalDTO;
  