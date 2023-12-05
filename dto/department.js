class departDto {
    constructor(depart) {
      this._id = depart._id;
      this.hospitalId = depart.hospitalId;
      this.departmentName = depart.departmentName;
      this.availableDoctors = depart.availableDoctors;
      this.dapartmentLogo = depart.dapartmentLogo;
    }
  }
  
  module.exports = departDto;
  