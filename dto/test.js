class TestDTO {
  constructor(test) {
    this._id = test._id;
    this.testName = test.testName;
    this.testCode = test.testCode;
    this.testDescription = test.testDescription;
    this.price = test.price;
    this.duration = test.duration;
    this.priceForMeditour = test.priceForMeditour;
  }
}

module.exports = TestDTO;
