const db = require("../db");
const shortid = require("shortid");

module.exports.index = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = 6;

  let start = (page - 1) * perPage;
  let end = page * perPage;

  let data = db.get("movies").value();
  let lastPage = Math.ceil(data.length / perPage);

  let pages = [];
  if (lastPage < 6) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    for (
      let i = page >= --lastPage ? lastPage - 4 : page - 2;
      i <= (page >= --lastPage) ? lastPage : page + 2;
      i++
    ) {
      pages.push(i);
    }
  }

  res.render("movies/index", {
    movies: data.slice(start, end),
    current: page,
    lastPage: lastPage,
    pages: pages
  });
};

module.exports.search = (req, res) => {
  let q = req.query.q;
  let matchedMovies = movies.filter(
    user => user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
  );

  res.render("movies/index", {
    movies: matchedMovies
  });
};

module.exports.create = (req, res) => {
  res.render("movies/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("movies")
    .push(req.body)
    .write();
  res.redirect("/movies");
};

module.exports.get = (req, res) => {
  let id = req.params.id;

  var movie = db
    .get("movies")
    .find({ id: id })
    .value();

  res.render("movies/view", {
    movie: movie
  });
};
