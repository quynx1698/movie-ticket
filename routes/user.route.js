var express = require("express");
var router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.get);

router.get("/update", controller.updateProfile);

router.post("/update", controller.postUpdate);

module.exports = router;
