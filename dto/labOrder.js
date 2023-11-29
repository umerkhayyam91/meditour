class orderDto {
  constructor(order) {
    this._id = order._id;
    this.labId = order.labId;
    this.orderId = order.orderId;
    this.testCode = order.testCode;
    this.testName = order.testName;
    this.patientName = order.patientName;
    this.MR_NO = order.MR_NO;
    this.date = order.date;
    this.status = order.status;
    this.results = order.results;
  }
}
module.exports = orderDto;