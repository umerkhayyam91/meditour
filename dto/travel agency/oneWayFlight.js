class oneWayFlightDTO {
    constructor(flight) {
      this._id = flight._id;
      this.agencyId = flight.flightId;
      this.companyName = flight.companyName;
      this.flightsNo = flight.flightsNo;
      this.companyLogo = flight.companyLogo;
      this.from = flight.from;
      this.to = flight.to;
      this.className = flight.className;
      this.departTime = flight.departTime;
      this.designationTime = flight.designationTime;
      this.passengers = flight.passengers;
      this.infant = flight.infant;
      this.directOrStay = flight.directOrStay;
      this.stayDesignation = flight.stayDesignation;
      this.stayduration = flight.stayduration;
      this.nextFlightNo = flight.nextFlightNo;
      this.afterStayDepartTime = flight.afterStayDepartTime;
      this.afterStayDesignationTime = flight.afterStayDesignationTime;
      this.winglets = flight.winglets;
      this.webBrowsing = flight.webBrowsing;
      this.streamingEntertainment = flight.streamingEntertainment;
      this.lightMealAvailability = flight.lightMealAvailability;
      this.handBag = flight.handBag;
      this.baggageWeight = flight.baggageWeight;
      this.cancelationDuration = flight.cancelationDuration;
      this.cancelationDeduct = flight.cancelationDeduct;
      this.ticketsCount = flight.ticketsCount;
      this.cancelPolicyDescription = flight.cancelPolicyDescription;
      this.meditourPrice = flight.meditourPrice;
      this.actualPrice = flight.actualPrice;
    }
  }
  module.exports = oneWayFlightDTO;
