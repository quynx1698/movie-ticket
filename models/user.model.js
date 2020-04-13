var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
  email: String,
  password: String,
  cart: Object,
});

var User = mongoose.model("User", movieSchema, "users");

module.exports = User;
