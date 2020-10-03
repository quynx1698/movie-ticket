var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  secure_code: String,
});

var Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
