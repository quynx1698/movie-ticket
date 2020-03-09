const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

const shortid = require("shortid");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ movies: [] }).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => res.render("index"));

app.get("/movies", (req, res) =>
  res.render("movies/index", {
    movies: db.get("movies").value()
  })
);

app.get("/movies/search", (req, res) => {
  let q = req.query.q;
  let matchedMovies = movies.filter(
    user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("movies/index", {
    movies: matchedMovies
  });
});

app.get("/movies/create", (req, res) => {
  res.render("movies/create");
});

app.post("/movies/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("movies")
    .push(req.body)
    .write();
  res.redirect("/movies");
});

app.get("/movies/:id", (req, res) => {
  let id = req.params.id;

  var movie = db
    .get("movies")
    .find({ id: id })
    .value();

  res.render("movies/view", {
    movie: movie
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
