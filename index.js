const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let movies = [
  { id: 1, name: "Spider man" },
  { id: 2, name: "Iron man" },
  { id: 3, name: "Hulk" }
];

app.get("/", (req, res) => res.render("index"));

app.get("/movies", (req, res) =>
  res.render("movies/index", {
    movies: movies
  })
);

app.get("/movies/search", (req, res) => {
  const q = req.query.q;
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
  movies.push(req.body);
  res.redirect("/movies");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
