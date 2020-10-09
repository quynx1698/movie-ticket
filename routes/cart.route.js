var express = require("express");
var router = express.Router();

const controller = require("../controllers/cart.controller");

router.get("/", controller.checkout);

router.post("/", controller.postCheckout);

router.get("/vnpay_return", controller.vnpReturn);

router.get("/vnpay_ipn", controller.vnpIpn);

module.exports = router;
