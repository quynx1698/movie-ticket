const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const generateUniqueId = require("generate-unique-id");

module.exports.checkout = (req, res) => {
  let sum = 0;
  let seat = req.query.seat;
  if (seat.includes("A") || seat.includes("B")) sum = 80000;
  if (seat.includes("C") || seat.includes("D")) sum = 65000;
  if (seat.includes("E") || seat.includes("F")) sum = 45000;
  let total = sum.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
  total = total.slice(1) + total.slice(0, 1);
  req.query.total = total;
  res.render("cart/index", {
    ticket: req.query,
  });
};

module.exports.postCheckout = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);
  let movie = await Movie.findById(req.body.id);

  const id = generateUniqueId();
  user.cart[id] = req.body;

  let seatInfo = req.body.seat;
  movie.showtime[req.body.showtimeDate][req.body.showtimeTime][
    seatInfo.slice(0, 1)
  ][seatInfo.slice(1)] = false;

  await User.findByIdAndUpdate(req.signedCookies.userId, { cart: user.cart });
  await Movie.findByIdAndUpdate(req.body.id, { showtime: movie.showtime });

  res.render("cart/success", {
    id: id,
  });
};
