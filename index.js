const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", "./views");

let movies = [
  { id: 1, name: "Spider man" },
  { id: 2, name: "Hulk" }
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
