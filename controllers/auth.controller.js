const User = require("../models/user.model");

module.exports.login = (req, res) => res.render("auth/login");

module.exports.postLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = await User.findOne({ email: email });

  if (!user) {
    res.render("auth/login", {
      errors: ["Người dùng không tồn tại"],
      values: req.body,
    });
    return;
  }

  if (user.password !== password) {
    res.render("auth/login", {
      errors: ["Sai mật khẩu"],
      values: req.body,
    });
    return;
  }

  res.cookie("userId", user.id, {
    signed: true,
  });

  res.redirect("/");
};
