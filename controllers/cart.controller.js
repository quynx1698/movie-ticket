const User = require("../models/user.model");
const generateUniqueId = require("generate-unique-id");

module.exports.postSeat = (req, res) => {
  let sum = 0;
  let seat = req.body.seat;
  if (seat.includes("A") || seat.includes("B")) sum = 80000;
  if (seat.includes("C") || seat.includes("D")) sum = 65000;
  if (seat.includes("E") || seat.includes("F")) sum = 45000;
  let total = sum.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
  total = total.slice(1) + total.slice(0, 1);
  req.body.total = total;
  res.render("cart/index", {
    ticket: req.body,
  });
};

module.exports.postTicket = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);
  const id = generateUniqueId();
  user.cart[id] = req.body;
  await User.findByIdAndUpdate(req.signedCookies.userId, { cart: user.cart });
  res.render("cart/success");
};
