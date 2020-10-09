const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const generateUniqueId = require("generate-unique-id");
const Order = require("../models/order.model");

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
  const newOrder = new Order(req.body);
  let data = await newOrder.save();
  let dataId = data.id;
  let total = req.body.total;
  total = total.slice(0, -1).split(",").join("");

  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var config = require("config");
  var dateFormat = require("dateformat");

  var tmnCode = config.get("vnp_TmnCode");
  var secretKey = config.get("vnp_HashSecret");
  var vnpUrl = config.get("vnp_Url");
  var returnUrl = config.get("vnp_ReturnUrl");

  var date = new Date();

  var createDate = dateFormat(date, "yyyymmddHHmmss");
  var orderId = dateFormat(date, "HHmmss");
  var amount = total;
  var bankCode = req.body.bankCode;

  var orderInfo = dataId;
  var orderType = "billpayment";
  var locale = "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require("qs");
  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require("sha256");

  var secureHash = sha256(signData);

  vnp_Params["vnp_SecureHashType"] = "SHA256";
  vnp_Params["vnp_SecureHash"] = secureHash;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });

  //Neu muon dung Redirect thi dong dong ben duoi
  // res.status(200).json({ code: "00", data: vnpUrl });
  //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
  res.redirect(vnpUrl);
};

module.exports.vnpReturn = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);

  var vnp_Params = req.query;

  let order = await Order.findById(vnp_Params["vnp_OrderInfo"]);

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var config = require("config");
  var tmnCode = config.get("vnp_TmnCode");
  var secretKey = config.get("vnp_HashSecret");

  var querystring = require("qs");
  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require("sha256");

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    if (vnp_Params["vnp_ResponseCode"] == "00") {
      user.cart[order.id] = order;
      await User.findByIdAndUpdate(req.signedCookies.userId, {
        cart: user.cart,
      });
      let movie = await Movie.findById(order.movieID);
      let date = order.showtimeDate;
      let time = order.showtimeTime;
      for (const seat of JSON.parse(order.seat)) {
        let seatLine = seat.slice(0, 1);
        let seatIndex = seat.slice(1);
        if (!movie.showtime[date][time][seatLine][seatIndex]) {
          req.app.locals.isBooked = true;
          res.redirect(req.app.locals.path);
          return;
        }
        movie.showtime[date][time][seatLine][seatIndex] = false;
      }
      req.app.locals.isBooked = false;
      await Movie.findByIdAndUpdate(movie.id, { showtime: movie.showtime });
    }
    res.render("cart/success", {
      code: vnp_Params["vnp_ResponseCode"],
      id: order.id,
      ticket: order,
    });
  } else {
    res.render("cart/success", { code: "97", id: order.id, ticket: order });
  }
};

module.exports.vnpIpn = (req, res) => {
  var vnp_Params = req.query;
  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  var config = require("config");
  var secretKey = config.get("vnp_HashSecret");
  var querystring = require("qs");
  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require("sha256");

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    var orderId = vnp_Params["vnp_TxnRef"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: "00", Message: "success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }
};

function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}
