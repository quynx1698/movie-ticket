const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const Order = require("../models/order.model");
const generateUniqueId = require("generate-unique-id");
const md5 = require("md5");
const url = require("url");

module.exports.checkout = (req, res) => {
  let seatList = req.query.seat;
  let sum = seatList.reduce((x, y) => {
    if (y.includes("A") || y.includes("B")) y = 155000;
    else if (y.includes("C") || y.includes("D")) y = 95000;
    else if (y.includes("E") || y.includes("F")) y = 55000;
    return x + y;
  }, 0);
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

  const newOrder = new Order({ secure_code: "none" });
  await newOrder.save();
  let order = await Order.findOne({ secure_code: "none" });

  let queryUrl = {
    merchant_site_code: 63933,
    return_url: "https://movie-ticket-express.herokuapp.com/cart/success",
    receiver: "smlie.wolves@gmail.com",
    order_code: order.id,
    price: 2000,
    currency: "vnd",
    quantity: 1,
    tax: 0,
    discount: 0,
    fee_cal: 0,
    fee_shipping: 0,
  };

  let secureStr = "";
  for (let prop in queryUrl) {
    secureStr += queryUrl[prop] + " ";
  }
  secureStr += "8de8a53bffa09e319b7807b6fd9e6e8a";
  let secureCode = md5(secureStr);
  queryUrl.secure_code = secureCode;
  await Order.findByIdAndUpdate(order.id, { secure_code: secureCode });
  queryUrl.cancel_url = "https://movie-ticket-express.herokuapp.com/cart/fail";

  let nlApi = url.format({
    protocol: "https",
    hostname: "nganluong.vn",
    pathname: "/checkout.php",
    query: queryUrl,
  });

  console.log(nlApi);

  res.redirect(nlApi);

  // const id = generateUniqueId();
  // user.cart[id] = req.body;
  // await User.findByIdAndUpdate(req.signedCookies.userId, { cart: user.cart });

  // let movie = await Movie.findById(req.body.movieID);

  // let date = req.body.showtimeDate;
  // let time = req.body.showtimeTime;
  // for (const seat of JSON.parse(req.body.seat)) {
  //   let seatLine = seat.slice(0, 1);
  //   let seatIndex = seat.slice(1);
  //   if (!movie.showtime[date][time][seatLine][seatIndex]) {
  //     req.app.locals.isBooked = true;
  //     res.redirect(req.app.locals.path);
  //     return;
  //   }
  //   movie.showtime[date][time][seatLine][seatIndex] = false;
  // }

  // req.app.locals.isBooked = false;

  // await Movie.findByIdAndUpdate(req.query.id, { showtime: movie.showtime });

  // res.render("cart/success", {
  //   id: id,
  //   ticket: req.body,
  // });
};
