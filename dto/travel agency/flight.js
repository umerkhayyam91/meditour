class flightDTO {
    constructor(flight) {
        this._id = flight._id;
        this.agencyId = flight.agencyId;
        this.trips = flight.trips;
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
module.exports = flightDTO;