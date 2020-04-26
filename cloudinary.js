var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "quynxcloudinary",
  api_key: "191153915672836",
  api_secret: "hnHJMY6bGVr9JjW1CKzf3DPrYtI",
});

module.exports = cloudinary;
