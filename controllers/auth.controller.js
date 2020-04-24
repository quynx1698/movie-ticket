const User = require("../models/user.model");

module.exports.login = (req, res) =>
  res.render("auth/login", {
    path: req.query.path,
    isSuccess: req.query.isSuccess,
  });

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

  res.redirect(req.query.path);
};

module.exports.create = (req, res) => {
  res.render("auth/create");
};

module.exports.postCreate = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let rePassword = req.body.rePassword;

  let user = await User.findOne({ email: email });

  if (user) {
    res.render("auth/create", {
      errors: ["Địa chỉ email đã tồn tại"],
    });
    return;
  }

  if (password != rePassword) {
    res.render("auth/create", {
      errors: ["Mật khẩu không trùng khớp"],
      values: req.body,
    });
    return;
  }

  const newUser = new User({
    email: email,
    password: password,
  });

  await newUser.save();

  res.redirect("/auth/login?path=" + req.query.path + "&isSuccess=true");
};
