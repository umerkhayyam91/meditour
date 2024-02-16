class orderDto {
  constructor(order) {
    this._id = order._id;
    this.labId = order.labId;
    this.userId = order.userId;
    this.tests = order.tests;
    this.orderId = order.orderId;
    this.preference = order.preference;
    this.currentLocation = order.currentLocation;
    this.prescription = order.prescription;
    this.patientName = order.patientName;
    this.MR_NO = order.MR_NO;
    this.totalAmount = order.totalAmount;
    this.status = order.status;
    this.results = order.results;
  }
}
module.exports = orderDto;
