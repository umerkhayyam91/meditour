class packageDTO {
  constructor(packages) {
    this._id = packages._id;
    this.donationId = packages.donationId;
    this.criteriaIds = packages.criteriaIds;
    this.userIds = packages.userIds;
    this.donationName = packages.donationName;
    this.targetAudience = packages.targetAudience;
    this.requiredAmount = packages.requiredAmount;
    this.totalDays = packages.totalDays;
    this.description = packages.description;
    this.images = packages.images;
  }
}
module.exports = packageDTO;
