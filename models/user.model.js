var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  thumbnail: String,
  dateCreate: String,
  firstname: String,
  lastname: String,
  sex: String,
  birthday: String,
  phoneNum: String,
  cmnd: String,
  address: String,
  district: String,
  city: String,
  cart: Object,
});

var User = mongoose.model("User", movieSchema, "users");

module.exports = User;
