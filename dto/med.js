class medDto {
    constructor(med) {
      this._id = med._id;
      this.generic = med.generic;
      this.medicineBrand = med.medicineBrand;
      this.medicineType = med.medicineType;
      this.strength = med.strength;
      this.packSize = med.packSize;
      this.priceMeditour = med.priceMeditour;
      this.actualPrice = med.actualPrice;
    }
  }
  
  module.exports = medDto;
  