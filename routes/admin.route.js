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

router.get("/times", controller.times);

router.post("/times", controller.postTimes);

router.get("/times/create/:id", controller.timesCreate);

router.post("/times/create/:id", controller.postTimesCreate);

router.get("/times/update/:id", controller.timesUpdate);

router.post("/times/update/:id", controller.postTimesUpdate);

router.get("/times/delete/:id", controller.timesDelete);

router.get("/seats", controller.seats);

router.post("/seats", controller.postSeats);

router.get("/users", controller.accounts);

router.get("/users/detail/:id", controller.accountsDetail);

router.get("/users/update/:id", controller.accountsUpdate);

router.post("/users/update/:id", controller.postAccountsUpdate);

router.get("/users/delete/:id", controller.accountsDelete);

module.exports = router;
