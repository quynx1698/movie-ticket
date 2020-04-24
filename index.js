require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const movieRoutes = require("./routes/movie.route");
const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const userRoutes = require("./routes/user.route");

const authMiddleware = require("./middlewares/auth.middleware");

const Movie = require("./models/movie.model");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static("public"));

app.get("/", async (req, res) => {
  let data = await Movie.find();
  res.render("index", {
    movies: data.slice(0, 3),
  });
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/cart", authMiddleware.requireAuthCart, cartRoutes);
app.use("/user", authMiddleware.requireAuth, userRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
