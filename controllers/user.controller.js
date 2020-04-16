const User = require("../models/user.model");

module.exports.get = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);

  let ticketId = Object.keys(user.cart);

  res.render("user/index", {
    user: user,
    ticketId: ticketId,
  });
};
