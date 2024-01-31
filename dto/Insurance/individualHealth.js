class insuranceDTO {
    constructor(insurance) {
      this._id = insurance._id;
      this.insuranceId = insurance.insuranceId;
      this.ageCriteria = insurance.ageCriteria;
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
      this.specializedInvestigationCoverage = insurance.specializedInvestigationCoverage;
      this.waitingPeriod = insurance.waitingPeriod;
      this.maternity = insurance.maternity;
      this.policyDocument = insurance.policyDocument;
      this.claimProcess = insurance.claimProcess;
      this.heading = insurance.heading;
      this.description = insurance.description;
      this.actualPrice = insurance.actualPrice;
      this.meditourPrice = insurance.meditourPrice;
      this.perYear = insurance.perYear;
    }
  }
  module.exports = insuranceDTO;
