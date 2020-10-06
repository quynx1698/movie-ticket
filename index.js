require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:admin@movie-ticket-cluster.z7jg7.gcp.mongodb.net/movie-ticket?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const movieRoutes = require("./routes/movie.route");
const authRoutes = require("./routes/auth.route");
const cartRoutes = require("./routes/cart.route");
const userRoutes = require("./routes/user.route");
const adminRoutes = require("./routes/admin.route");

const authMiddleware = require("./middlewares/auth.middleware");

const Movie = require("./models/movie.model");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
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

app.get("/nganluong_b61fbc0de5644ae4736cda7ab27f9c83.html", (req, res) => {
  res.send("b61fbc0de5644ae4736cda7ab27f9c83");
});

app.get("/baokim35facb657242d20ed8075da512b86e86.txt", (req, res) => {
  res.send("35facb657242d20ed8075da512b86e86");
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/cart", authMiddleware.requireAuthCart, cartRoutes);
app.use("/user", authMiddleware.requireAuth, userRoutes);
app.use("/admin", authMiddleware.requireAdmin, adminRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
