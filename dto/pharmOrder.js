class pharmOrderDto {
  constructor(pharmOrder) {
    this._id = pharmOrder._id;
    this.orderId = pharmOrder.orderId;
    this.pharmId = pharmOrder.pharmId;
    this.userId = pharmOrder.userId;
    this.medicines = pharmOrder.medicines;
    this.preference = pharmOrder.preference;
    this.currentLocation = pharmOrder.currentLocation;
    this.prescription = pharmOrder.prescription;
    this.customerName = pharmOrder.customerName;
    this.MR_NO = pharmOrder.MR_NO;
    this.totalAmount = pharmOrder.totalAmount;
    this.status = pharmOrder.status;
  }
}
module.exports = pharmOrderDto;
