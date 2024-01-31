class insuranceDTO {
    constructor(insurance) {
      this._id = insurance._id;
      this.insuranceId = insurance.insuranceId;
      this.packageName = insurance.packageName;
      this.packageLogo = insurance.packageLogo;
      this.medicalCover = insurance.medicalCover;
      this.coveringUpto = insurance.coveringUpto;
      this.adndCoverage = insurance.adndCoverage;
      this.repatriationCoverage = insurance.repatriationCoverage;
      this.medExpensesHospitalizationCoverage = insurance.medExpensesHospitalizationCoverage;
      this.emergencyReturnHomeCoverage = insurance.emergencyReturnHomeCoverage;
      this.tripCancellation = insurance.tripCancellation;
      this.luggageArrivalDelay = insurance.luggageArrivalDelay;
      this.flightDelay = insurance.flightDelay;
      this.travelStayOverOneFamMember = insurance.travelStayOverOneFamMember;
      this.passportLoss = insurance.passportLoss;
      this.baggageLoss = insurance.baggageLoss;
      this.policyFile = insurance.policyFile;
      this.actualPrice = insurance.actualPrice;
      this.meditourPrice = insurance.meditourPrice;
      this.perYear = insurance.perYear;
      this.tripType = insurance.tripType;
    }
  }
  module.exports = insuranceDTO;
