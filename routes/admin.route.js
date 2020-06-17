var express = require("express");
var router = express.Router();

const controller = require("../controllers/admin.controller");
const { route } = require("./movie.route");

router.get("/", controller.index);

router.get("/movies", controller.movies);

router.get("/movies/create", controller.moviesCreate);

router.post("/movies/create", controller.postMoviesCreate);

router.get("/movies/update/:id", controller.moviesUpdate);

router.post("/movies/update/:id", controller.postMoviesUpdate);

router.get("/movies/delete/:id", controller.moviesDelete);

router.get("/tickets", controller.tickets);

router.get("/tickets/detail/:id", controller.ticketsDetail);

router.get("/tickets/update/:id", controller.ticketsUpdate);

router.post("/tickets/update/:id", controller.postTicketsUpdate);

router.get("/tickets/delete/:id", controller.ticketsDelete);

module.exports = router;
