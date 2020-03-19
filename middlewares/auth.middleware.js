const db = require("../db");

module.exports.requireAuth = (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect("/auth/login");
    return;
  }

  let user = db.get("users").find({
    id: req.signedCookies.userId
  });

  if (!user) {
    res.redirect("/auth/login");
    return;
  }

  next();
};
