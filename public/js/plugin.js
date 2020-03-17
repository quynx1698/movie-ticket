particlesJS.load("particles-js", "/json/particles.json", function() {
  console.log("callback - particles.js config loaded");
});

window.onscroll = function() {
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
