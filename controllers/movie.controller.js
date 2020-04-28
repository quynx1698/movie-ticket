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

module.exports.search = (req, res) => {
  let q = req.query.q;
  let matchedMovies = movies.filter(
    (user) => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("movies/index", {
    movies: matchedMovies,
  });
};

module.exports.create = (req, res) => {
  res.render("movies/create");
};

module.exports.postCreate = (req, res) => {
  // req.body.id = shortid.generate();
  // db.get("movies")
  //   .push(req.body)
  //   .write();
  res.redirect("/movies");
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
      let timeArr = time.split(":");
      if (i == 0) {
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
