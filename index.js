const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const movieRoutes = require("./routes/movie.route");
const authRoutes = require("./routes/auth.route");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
