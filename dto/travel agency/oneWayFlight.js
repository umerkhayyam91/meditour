class oneWayFlightDTO {
    constructor(flight) {
      this._id = flight._id;
      this.agencyId = flight.agencyId;
      this.trips = flight.trips;
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
