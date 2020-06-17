const Movie = require("../models/movie.model");
const User = require("../models/user.model");
const cloudinary = require("../cloudinary");

module.exports.index = (req, res) => {
  res.render("admin/index");
};

module.exports.movies = async (req, res) => {
  let movies = await Movie.find();

  res.render("admin/movies/index", {
    movies: movies,
  });
};

module.exports.moviesCreate = (req, res) => {
  res.render("admin/movies/create");
};

module.exports.postMoviesCreate = async (req, res) => {
  const file = req.files.thumbnail;
  thumbnail = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: "movie_thumb",
  });
  req.body.thumbnail = thumbnail.url;
  const newMovie = new Movie(req.body);

  await newMovie.save();

  res.redirect("/admin/movies");
};

module.exports.moviesUpdate = async (req, res) => {
  let id = req.params.id;

  let movie = await Movie.findById(id);
  res.render("admin/movies/update", {
    movie: movie,
  });
};

module.exports.postMoviesUpdate = async (req, res) => {
  let id = req.params.id;
  const file = req.files.thumbnail;
  thumbnail = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: "movie_thumb/" + id,
  });
  req.body.thumbnail = thumbnail.url;

  await Movie.findByIdAndUpdate(id, req.body);
  res.redirect("/admin/movies");
};

module.exports.moviesDelete = async (req, res) => {
  let id = req.params.id;

  await Movie.findByIdAndDelete(id);
  res.redirect("/admin/movies");
};

module.exports.tickets = async (req, res) => {
  let users = await User.find();

  res.render("admin/tickets/index", {
    users: users,
  });
};

module.exports.ticketsDetail = async (req, res) => {
  let users = await User.find();
  let id = req.params.id;
  let ticket;

  for (let user of users) {
    for (let crt in user.cart) {
      if (crt == id) {
        ticket = user.cart[id];
      }
    }
  }

  res.render("admin/tickets/detail", {
    ticketId: id,
    ticket: ticket,
  });
};

module.exports.ticketsUpdate = async (req, res) => {
  let users = await User.find();
  let id = req.params.id;
  let ticket;

  for (let user of users) {
    for (let crt in user.cart) {
      if (crt == id) {
        ticket = user.cart[id];
      }
    }
  }

  res.render("admin/tickets/update", {
    ticketId: id,
    ticket: ticket,
  });
};

module.exports.postTicketsUpdate = async (req, res) => {
  let users = await User.find();
  let id = req.params.id;

  for (let user of users) {
    for (let crt in user.cart) {
      if (crt == id) {
        let data = await User.findById(user.id);
        data.cart[id] = req.body;
        await User.findByIdAndUpdate(user.id, { cart: data.cart });

        res.redirect("/admin/tickets");
        return;
      }
    }
  }
};

module.exports.ticketsDelete = async (req, res) => {
  let users = await User.find();
  let id = req.params.id;

  for (let user of users) {
    for (let crt in user.cart) {
      if (crt == id) {
        let data = await User.findById(user.id);
        delete data.cart[id];
        await User.findByIdAndUpdate(user.id, { cart: data.cart });

        res.redirect("/admin/tickets");
        return;
      }
    }
  }
};
