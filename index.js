const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => res.render("index"));

app.get("/movies", (req, res) =>
  res.render("movies/index", {
    movies: [
      { id: 1, name: "Spider man" },
      { id: 2, name: "Hulk" }
    ]
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
