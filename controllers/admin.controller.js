const Movie = require("../models/movie.model");
const User = require("../models/user.model");
const cloudinary = require("../cloudinary");
const { findByIdAndUpdate } = require("../models/movie.model");

module.exports.index = (req, res) => {
  res.render("admin/index");
};

module.exports.movies = async (req, res) => {
  let movies = await Movie.find();

  res.render("admin/movies/index", {
    movies: movies,
  });
};

module.exports.moviesCreate = (req, res) => res.render("admin/movies/create");

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

module.exports.times = async (req, res) => {
  let movies = await Movie.find();

  res.render("admin/times/index", {
    movies: movies,
  });
};

module.exports.postTimes = async (req, res) => {
  let movie = await Movie.findById(req.body.movieID);

  res.render("admin/times/index", {
    movie: movie,
  });
};

module.exports.timesCreate = async (req, res) =>
  res.render("admin/times/create");

module.exports.postTimesCreate = async (req, res) => {
  let id = req.params.id;
  let movie = await Movie.findById(id);

  let seat = {
    A: seatList(12),
    B: seatList(12),
    C: seatList(12),
    D: seatList(12),
    E: seatList(10),
    F: seatList(8),
  };

  let times = req.body.showtimeTime.split(",");
  let date = req.body.showtimeDate;
  movie.showtime[date] = {};
  for (time of times) {
    movie.showtime[date][time] = seat;
  }

  await Movie.findByIdAndUpdate(id, { showtime: movie.showtime });
  res.redirect("/admin/times");
};

function seatList(index) {
  let arr = [];
  for (let i = 0; i < index; i++) {
    arr.push(false);
  }
  return arr;
}

module.exports.timesUpdate = async (req, res) => {
  let id = req.params.id;
  let movie = await Movie.findById(id);

  let date = req.query.showtimeDate;
  let times = Object.keys(movie.showtime[date]);

  res.render("admin/times/update", {
    date: date,
    times: times,
  });
};

module.exports.postTimesUpdate = async (req, res) => {
  let id = req.params.id;
  let movie = await Movie.findById(id);

  let date = req.query.showtimeDate;
  let oldTimes = Object.keys(movie.showtime[date]);
  let newTimes = JSON.parse(req.body.showtimeTime);

  let removedTimes = oldTimes.filter((x) => !newTimes.includes(x));
  for (time of removedTimes) {
    delete movie.showtime[date][time];
  }

  let addedTimes = newTimes.filter((x) => !oldTimes.includes(x));
  for (time of addedTimes) {
    movie.showtime[date][time] = {
      A: seatList(12),
      B: seatList(12),
      C: seatList(12),
      D: seatList(12),
      E: seatList(10),
      F: seatList(8),
    };
  }

  await Movie.findByIdAndUpdate(id, { showtime: movie.showtime });
  res.redirect("/admin/times");
};

module.exports.timesDelete = async (req, res) => {
  let id = req.params.id;
  let movie = await Movie.findById(id);
  let date = req.query.showtimeDate;

  delete movie.showtime[date];
  await Movie.findByIdAndUpdate(id, { showtime: movie.showtime });
  res.redirect("/admin/times");
};
