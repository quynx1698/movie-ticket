var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  movieID: String,
  movieName: String,
  showtimeDate: String,
  showtimeTime: String,
  seat: String,
  total: String,
  name: String,
  phoneNum: String,
  cmnd: String,
  address: String,
  city: String,
  bankCode: String,
});

var Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
