class pharmOrderDto {
    constructor(pharmOrder) {
      this._id = pharmOrder._id;
      this.orderId = pharmOrder.orderId;
      this.medCode = pharmOrder.medCode;
      this.pharmId = pharmOrder.pharmId;
      this.customerName = pharmOrder.customerName;
      this.MR_NO = pharmOrder.MR_NO;
      this.totalAmount = pharmOrder.totalAmount;
      this.status = pharmOrder.status;
    }
  }
  module.exports = pharmOrderDto;