particlesJS.load("particles-js", "/json/particles.json", function () {
  console.log("callback - particles.js config loaded");
});

window.onscroll = function () {
  myFunction();
};

var header = document.getElementById("header-wrap");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("fixed-header");
  } else {
    header.classList.remove("fixed-header");
  }
}

var loginBtn = document.getElementById("login-btn");
if (document.cookie.includes("userId")) {
  loginBtn.innerHTML =
    'Đăng xuất &nbsp<i class="fa fa-sign-out" aria-hidden="true"></i>';
  loginBtn.addEventListener("click", function () {
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
  });
} else {
  loginBtn.href = "/auth/login?path=" + document.location.pathname;
}
