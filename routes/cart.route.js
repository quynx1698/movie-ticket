var express = require("express");
var router = express.Router();

const controller = require("../controllers/cart.controller");

router.get("/", controller.checkout);

router.post("/", controller.postCheckout);

module.exports = router;
