class orderDto {
  constructor(lab) {
    this.orderId = lab.orderId;
    this.testCode = lab.testCode;
    this.testName = lab.testName;
    this.patientName = lab.patientName;
    this.MR_NO = lab.MR_NO;
    this.date = lab.date;
    this.status = lab.status;
    this.results = lab.results;
  }
}
module.exports = orderDto;