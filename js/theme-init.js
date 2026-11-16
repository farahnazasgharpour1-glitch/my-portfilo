/* اجرای زودهنگام برای جلوگیری از پرش تم (فلش سفید). عمداً کوچک و بدون وابستگی است. */
(function () {
  var d = document.documentElement;
  try {
    var t = localStorage.getItem("portfolio-theme");
    if (t === "light" || t === "dark") d.dataset.theme = t;
    else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) d.dataset.theme = "dark";
  } catch (_) {}
})();
