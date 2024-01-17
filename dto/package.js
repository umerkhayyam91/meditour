class packageDTO {
    constructor(packages) {
      this._id = packages._id;
      this.donationId = packages.donationId;
      this.userIds = packages.userIds;
      this.donationType = packages.donationType;
      this.targetAudience = packages.targetAudience;
      this.requiredAmount = packages.requiredAmount;
      this.totalDays = packages.totalDays;
      this.images = packages.images;
    }
  }
  module.exports = packageDTO;
  