var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  pg: String,
  duration: String,
  actor: String,
  director: String,
  release: String,
  nation: String,
  imdb: Number,
  producer: String,
  description: String,
  thumbnail: String,
  showtime: Object,
});

var Movie = mongoose.model("Movie", movieSchema, "movies");

module.exports = Movie;
