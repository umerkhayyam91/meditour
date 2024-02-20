class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.gender = user.gender;
    this.mrNo = user.mrNo;
    this.dateOfBirth = user.dateOfBirth;
    this.phone = user.phone;
    this.userImage = user.userImage;
    this.password = user.password;
    this.favouriteLabs = user.favouriteLabs;
    this.favouritePharmacies= user.favouritePharmacies;
  }
}

module.exports = UserDTO;
