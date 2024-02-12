class vehicleDetailDTO{
    constructor(vehicleDetail){
        this._id = vehicleDetail._id;
        this.vehicleType = vehicleDetail.vehicleType;
        this.vehicleName = vehicleDetail.vehicleName;
        this.vehicleModel = vehicleDetail.vehicleModel;
        this.vehicleYear = vehicleDetail.vehicleYear;
        this.vehicleColour = vehicleDetail.vehicleColour;
        this.vehicleVinNo = vehicleDetail.vehicleVinNo;
        this.vehicleRegisterationNo = vehicleDetail.vehicleRegisterationNo;
        this.vehicleRegisterationDate = vehicleDetail.vehicleRegisterationDate;
        this.actualPricePerHour =vehicleDetail .actualPricePerHour;
        this.meditourPricePerHour = vehicleDetail.meditourPricePerHour;
      

        
    }
}
module.exports= vehicleDetailDTO;