(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var t = localStorage.getItem("portfolio-theme");
    if (t === "light" || t === "dark") d.dataset.theme = t;
    else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) d.dataset.theme = "dark";
    var l = localStorage.getItem("portfolio-language");
    if (l === "en") { d.lang = "en"; d.dir = "ltr"; }
  } catch (_) {}
})();
