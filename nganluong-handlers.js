const { NganLuong } = require("vn-payments");

/* eslint-disable no-param-reassign */
const TEST_CONFIG = NganLuong.TEST_CONFIG;
const nganluong = new NganLuong({
  paymentGateway: TEST_CONFIG.paymentGateway,
  merchant: "63933",
  receiverEmail: "smlie.wolves@gmail.com",
  secureSecret: "8de8a53bffa09e319b7807b6fd9e6e8a",
});

module.exports.checkoutNganLuong = (req, res) => {
  const checkoutData = res.locals.checkoutData;
  checkoutData.returnUrl = `http://${req.headers.host}/cart/callback`;
  checkoutData.cancelUrl = `http://${req.headers.host}/`;
  checkoutData.orderInfo = "Thanh toan ve xem phim";
  checkoutData.locale = checkoutData.locale === "en" ? "en" : "vi";
  checkoutData.paymentType = "1";
  checkoutData.totalItem = "1";

  return nganluong.buildCheckoutUrl(checkoutData).then((checkoutUrl) => {
    res.locals.checkoutUrl = checkoutUrl;

    return checkoutUrl;
  });
};

module.exports.callbackNganLuong = (req, res) => {
  const query = req.query;

  return nganluong.verifyReturnUrl(query).then((results) => {
    if (results) {
      res.locals.email = results.customerEmail;
      res.locals.orderId = results.transactionId || "";
      res.locals.price = results.amount;
      res.locals.isSucceed = results.isSuccess;
      res.locals.message = results.message;
    } else {
      res.locals.isSucceed = false;
    }
  });
};
