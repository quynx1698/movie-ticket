var express = require("express");
var router = express.Router();

const controller = require("../controllers/cart.controller");

router.post("/", controller.postSeat);

router.post("/success", controller.postTicket);

module.exports = router;
