class tourDTO {
    constructor(tour) {
      this._id = tour._id;
      this.agencyId = tour.agencyId;
      this.packageName = tour.packageName;
      this.packageDuration = tour.packageDuration;
      this.from = tour.from;
      this.to = tour.to;
      this.departTime = tour.departTime;
      this.designationTime = tour.designationTime;
      this.className = tour.className;
      this.breakfastQuantity = tour.breakfastQuantity;
      this.lunchQuantity = tour.lunchQuantity;
      this.dinnerQuantity = tour.dinnerQuantity;
      this.dayByDayPlans = tour.dayByDayPlans;
      this.recentTourPolicy = tour.recentTourPolicy;
      this.actualPricePerHead = tour.actualPricePerHead;
      this.meditourPricePerHead = tour.meditourPricePerHead;
      this.actualPricePerCouple = tour.actualPricePerCouple;
      this.meditourPricePerCouple = tour.meditourPricePerCouple;
    }
  }
  module.exports = tourDTO;