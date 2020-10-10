const Movie = require("../models/movie.model");

function pageList(page) {
  let pages = [];
  for (let i = page - 2; i <= page + 2; i++) {
    pages.push(i);
  }
  return pages;
}

module.exports.index = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = 6;

  let start = (page - 1) * perPage;
  let end = page * perPage;

  let data = await Movie.find();
  let lastPage = Math.ceil(data.length / perPage);

  let pages = [];
  if (lastPage < 6) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    if (page < 3) {
      pages = pageList(3);
    } else if (page > lastPage - 2) {
      pages = pageList(lastPage - 2);
    } else {
      pages = pageList(page);
    }
  }

  res.render("movies/index", {
    movies: data.slice(start, end),
    current: page,
    lastPage: lastPage,
    pages: pages,
  });
};

module.exports.search = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = 6;

  let start = (page - 1) * perPage;
  let end = page * perPage;

  let movieGenre = req.query.movieGenre;
  let movies;
  if(movieGenre == "all") {
    movies = await Movie.find();
  }
  else {
    movies = await Movie.find({ genre: movieGenre });
  }

  let movieName = normalizeVN(req.query.movieName);
  let matchedMovies = movies.filter(movie => normalizeVN(movie.name).indexOf(movieName) !== -1)
  let lastPage = Math.ceil(matchedMovies.length / perPage);

  let pages = [];
  if (lastPage < 6) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    if (page < 3) {
      pages = pageList(3);
    } else if (page > lastPage - 2) {
      pages = pageList(lastPage - 2);
    } else {
      pages = pageList(page);
    }
  }

  res.render("movies/index", {
    movies: matchedMovies.slice(start, end),
    current: page,
    lastPage: lastPage,
    pages: pages,
  });
};

module.exports.get = async (req, res) => {
  let id = req.params.id;
  req.app.locals.path = "/movies/" + id;
  let movie = await Movie.findById(id);

  let showtimeDate = [];
  let now = new Date();
  let nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let day in movie.showtime) {
    let dayArr = day.split("/");
    let dateShow = new Date(dayArr[2], dayArr[1] - 1, dayArr[0]);
    if (dateShow >= nowDate) showtimeDate.push(day);
  }

  let showtimeTime = {};
  for (let i = 0; i < showtimeDate.length; i++) {
    showtimeTime[showtimeDate[i]] = [];
    for (let time in movie.showtime[showtimeDate[i]]) {
      let dayArr = showtimeDate[i].split("/");
      let dateShow = new Date(dayArr[2], dayArr[1] - 1, dayArr[0]);
      let timeArr = time.split(":");
      if (dateShow == nowDate) {
        if (timeArr[0] > now.getHours()) {
          showtimeTime[showtimeDate[i]].push(time);
        }
        if (timeArr[0] == now.getHours() && timeArr[1] >= now.getMinutes()) {
          showtimeTime[showtimeDate[i]].push(time);
        }
      } else {
        showtimeTime[showtimeDate[i]].push(time);
      }
    }
  }

  let err = req.app.locals.isBooked;

  res.render("movies/view", {
    movie: movie,
    showtimeDate: showtimeDate,
    showtimeTime: showtimeTime,
    error: err,
  });
};

function normalizeVN(str) {
  let newStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  return newStr.toLowerCase();
}
