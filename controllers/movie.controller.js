const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) =>
  res.render("movies/index", {
    movies: db.get("movies").value()
  });

module.exports.search = (req, res) => {
  let q = req.query.q;
  let matchedMovies = movies.filter(
    user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("movies/index", {
    movies: matchedMovies
  });
};

module.exports.create = (req, res) => {
  res.render("movies/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("movies")
    .push(req.body)
    .write();
  res.redirect("/movies");
};

module.exports.get = (req, res) => {
  let id = req.params.id;

  var movie = db
    .get("movies")
    .find({ id: id })
    .value();

  res.render("movies/view", {
    movie: movie
  });
};
