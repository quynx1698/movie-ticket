const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const generateUniqueId = require("generate-unique-id");
const { checkoutNganLuong } = require("../nganluong-handlers");

module.exports.checkout = async (req, res) => {
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

  const userAgent = req.headers["user-agent"];
  console.log("userAgent", userAgent);

  const params = Object.assign({}, req.body);

  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const amount = 1;
  const now = new Date();

  // NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
  const checkoutData = {
    amount,
    clientIp: clientIp.length > 15 ? "127.0.0.1" : clientIp,
    locale: "vn",
    billingPostCode: params.cmnd || "",
    deliveryAddress: params.address || "",
    deliveryCity: params.city || "",
    deliveryCountry: params.billingCountry || "",
    currency: "VND",
    customerEmail: user.email,
    customerPhone: params.phoneNum,
    orderId: `node-${now.toISOString()}`,
    // returnUrl: ,
    transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
    customerId: user.email,
  };

  // pass checkoutData to gateway middleware via res.locals
  res.locals.checkoutData = checkoutData;

  // Note: these handler are asynchronous
  let asyncCheckout = null;
  switch (params.paymentMethod) {
    case "nganluong":
      // this param is not expected in other gateway
      checkoutData.customerName = params.name;
      checkoutData.paymentMethod = "ATM_ONLINE";
      checkoutData.bankCode = "EXB";
      asyncCheckout = checkoutNganLuong(req, res);
      break;
    case "nganluongvisa":
      // this param is not expected in other gateway
      checkoutData.customerName = params.name;
      checkoutData.paymentMethod = "VISA";
      asyncCheckout = checkoutNganLuong(req, res);
      break;
    default:
      break;
  }

  if (asyncCheckout) {
    asyncCheckout
      .then((checkoutUrl) => {
        res.writeHead(301, { Location: checkoutUrl.href });
        res.end();
      })
      .catch((err) => {
        res.send(err.message);
      });
  } else {
    res.send("Payment method not found");
  }
  // let user = await User.findById(req.signedCookies.userId);

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
