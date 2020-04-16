var express = require("express");
var router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.get);

module.exports = router;
