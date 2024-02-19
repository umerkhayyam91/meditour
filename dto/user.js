class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.gender = user.gender;
    this.mrNo = user.mrNo;
    this.dateOfBirth = user.dateOfBirth;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.favouriteLabs = user.favouriteLabs;
    this.favouritePharmacies= user.favouritePharmacies;
  }
}

module.exports = UserDTO;
