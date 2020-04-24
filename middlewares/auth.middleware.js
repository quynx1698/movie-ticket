const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect("/auth/login?path=/user");
    return;
  }

  let user = await User.findById(req.signedCookies.userId);

  if (!user) {
    res.redirect("/auth/login?path=/user");
    return;
  }

  next();
};

module.exports.requireAuthCart = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect("/auth/login?path=" + req.app.locals.path);
    return;
  }

  let user = await User.findById(req.signedCookies.userId);

  if (!user) {
    res.redirect("/auth/login?path=" + req.app.locals.path);
    return;
  }

  next();
};
