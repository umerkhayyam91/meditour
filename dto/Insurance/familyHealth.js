class familyHealthDTO {
    constructor(insurance) {
      this._id = insurance._id;
      this.insuranceId = insurance.insuranceId;
      this.yourAgeCriteria = insurance.yourAgeCriteria;
      this.spouseAgeCriteria = insurance.spouseAgeCriteria;
      this.kidsAge = insurance.kidsAge;
      this.hospitalizationLimit = insurance.hospitalizationLimit;
      this.packageName = insurance.packageName;
      this.packageLogo = insurance.packageLogo;
      this.hospitalizationPerPerson = insurance.hospitalizationPerPerson;
      this.dailyRoomAndBoardLimit = insurance.dailyRoomAndBoardLimit;
      this.claimPayoutRatio = insurance.claimPayoutRatio;
      this.hospitals = insurance.hospitals;
      this.laboratories = insurance.laboratories;
      this.icuCcuLimits = insurance.icuCcuLimits;
      this.accidentalEmergencyLimits = insurance.accidentalEmergencyLimits;
      this.ambulanceCoverage = insurance.ambulanceCoverage;
      this.OPD = insurance.OPD;
      this.waitingPeriod = insurance.waitingPeriod;
      this.policyDocument = insurance.policyDocument;
      this.heading = insurance.heading;
      this.description = insurance.description;
      this.actualPrice = insurance.actualPrice;
      this.meditourPrice = insurance.meditourPrice;
      this.perYear = insurance.perYear;
    }
  }
  module.exports = familyHealthDTO;
