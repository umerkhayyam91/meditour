class hospitalDTO {
    constructor(hospital) {
      this._id = hospital._id;
      this.hospitalFirstName = hospital.hospitalFirstName;
      this.hospitalLastName = hospital.hospitalLastName;
      this.pmdcNumber = hospital.pmdcNumber;
      this.pmdcExpiryDate = hospital.pmdcExpiryDate;
      this.authFirstName = hospital.authFirstName;
      this.authMiddleName = hospital.authMiddleName;
      this.authLastName = hospital.authLastName;
      this.cnicOrPassportNo = hospital.cnicOrPassportNo;
      this.cnicOrPassportExpiry = hospital.cnicOrPassportExpiry;
      this.hospitalAddress = hospital.hospitalAddress;
      this.state = hospital.state;
      this.country = hospital.country;
      this.website = hospital.email;
      this.twitter = hospital.twitter;
      this.facebook = hospital.facebook;
      this.instagram = hospital.instagram;
      this.incomeTaxNo = hospital.incomeTaxNo;
      this.salesTaxNo = hospital.salesTaxNo;
      this.bankName = hospital.bankName;
      this.accountHolderName = hospital.accountHolderName;
      this.accountNumber = hospital.accountNumber;
      this.hospitalLogo = hospital.hospitalLogo;
      this.pmdcImage = hospital.pmdcImage;
      this.taxFileImage = hospital.taxFileImage;
      this.cnicImage = hospital.cnicImage;
    }
  }
  
  module.exports = hospitalDTO;
  