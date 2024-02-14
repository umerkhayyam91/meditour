class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.gender = user.gender;
    this.email = user.email;
    this.phone = user.phone;
    this.password = user.password;
    this.favouriteLabs = lab.favouriteLabs;
  }
}

module.exports = UserDTO;
