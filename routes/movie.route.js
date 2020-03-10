var express = require("express");
var router = express.Router();

const controller = require("../controllers/movie.controller");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.post("/create", controller.postCreate);

router.get("/:id", controller.get);

module.exports = router;
