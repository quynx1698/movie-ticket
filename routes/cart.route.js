var express = require("express");
var router = express.Router();

const controller = require("../controllers/cart.controller");

router.post("/", controller.postSeat);

module.exports = router;
