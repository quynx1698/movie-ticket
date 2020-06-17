const User = require("../models/user.model");
const cloudinary = require("../cloudinary");

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
  let user = await User.findById(req.signedCookies.userId);
  const file = req.files.avt;
  avt = await cloudinary.uploader.upload(file.tempFilePath, {
    public_id: "user_avt/" + user.id,
  });
  req.body.thumbnail = avt.url;
  await User.findByIdAndUpdate(req.signedCookies.userId, req.body);
  res.redirect("/user");
};
