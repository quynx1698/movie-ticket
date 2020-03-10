var express = require("express");
var router = express.Router();
const shortid = require("shortid");
const db = require("../db");

router.get("/", (req, res) =>
  res.render("movies/index", {
    movies: db.get("movies").value()
  })
);

router.get("/search", (req, res) => {
  let q = req.query.q;
  let matchedMovies = movies.filter(
    user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("movies/index", {
    movies: matchedMovies
  });
});

router.get("/create", (req, res) => {
  res.render("movies/create");
});

router.post("/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("movies")
    .push(req.body)
    .write();
  res.redirect("/movies");
});

router.get("/:id", (req, res) => {
  let id = req.params.id;

  var movie = db
    .get("movies")
    .find({ id: id })
    .value();

  res.render("movies/view", {
    movie: movie
  });
});

module.exports = router;
