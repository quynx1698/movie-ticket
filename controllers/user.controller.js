const User = require("../models/user.model");

module.exports.get = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);

  let ticketId = Object.keys(user.cart);

  res.render("user/index", {
    user: user,
    ticketId: ticketId,
  });
};

module.exports.updateProfile = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);

  res.render("user/update", {
    user: user,
  });
};

module.exports.postUpdate = async (req, res) => {
  await User.findByIdAndUpdate(req.signedCookies.userId, req.body);
  res.redirect("/user");
};
