class UserDTO{
    constructor(user){
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.password = user.password;
    }
}

module.exports = UserDTO;