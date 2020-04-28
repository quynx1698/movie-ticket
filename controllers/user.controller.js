const User = require("../models/user.model");
const cloudinary = require("../cloudinary");

module.exports.get = async (req, res) => {
  let user = await User.findById(req.signedCookies.userId);

  let ticketId = Object.keys(user.cart);
  for (const ticket of ticketId) {
    user.cart[ticket].seat = JSON.parse(user.cart[ticket].seat);
    let seatList = user.cart[ticket].seat;
    let sum = seatList.reduce((x, y) => {
      if (y.includes("A") || y.includes("B")) y = 80000;
      if (y.includes("C") || y.includes("D")) y = 65000;
      if (y.includes("E") || y.includes("F")) y = 45000;
      return x + y;
    }, 0);
    let total = sum.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    total = total.slice(1) + total.slice(0, 1);
    user.cart[ticket].total = total;
  }

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
