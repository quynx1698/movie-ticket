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

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
