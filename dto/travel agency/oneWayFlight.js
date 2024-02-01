class travelAgencyDTO {
    constructor(agency) {
      this._id = agency._id;
      this.agencyId = agency.agencyId;
      this.companyName = agency.companyName;
      this.flightsNo = agency.flightsNo;
      this.companyLogo = agency.companyLogo;
      this.from = agency.from;
      this.to = agency.to;
      this.className = agency.className;
      this.departTime = agency.departTime;
      this.designationTime = agency.designationTime;
      this.passengers = agency.passengers;
      this.infant = agency.infant;
      this.directOrStay = agency.directOrStay;
      this.stayDesignation = agency.stayDesignation;
      this.stayduration = agency.stayduration;
      this.nextFlightNo = agency.nextFlightNo;
      this.afterStayDepartTime = agency.afterStayDepartTime;
      this.afterStayDesignationTime = agency.afterStayDesignationTime;
      this.winglets = agency.winglets;
      this.webBrowsing = agency.webBrowsing;
      this.streamingEntertainment = agency.streamingEntertainment;
      this.lightMealAvailability = agency.lightMealAvailability;
      this.handBag = agency.handBag;
      this.baggageWeight = agency.baggageWeight;
      this.cancelationDuration = agency.cancelationDuration;
      this.cancelationDeduct = agency.cancelationDeduct;
      this.ticketsCount = agency.ticketsCount;
      this.cnicancelPolicyDescriptioncImage = agency.cnicancelPolicyDescriptioncImage;
      this.meditourPrice = agency.meditourPrice;
      this.actualPrice = agency.actualPrice;
    }
  }
  module.exports = travelAgencyDTO;
