"use strict";
/* پورتفولیوی فرحناز اصغرپور — رفتارها
   متن‌ها در خود HTML هستند (نه در جاوااسکریپت)، پس موتورهای جست‌وجو هر دو زبان را می‌خوانند. */

const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 700px)");

const safeSave = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };

/* ---------- تم ---------- */
const themeToggle = $("#theme-toggle");
function applyTheme(next) {
  root.dataset.theme = next;
  if (themeToggle) themeToggle.setAttribute("aria-label", next === "dark" ? themeToggle.dataset.labelLight : themeToggle.dataset.labelDark);
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "dark" ? "#14102b" : "#f6f3ff");
}
if (themeToggle) themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  safeSave("portfolio-theme", next);
});
applyTheme(root.dataset.theme === "dark" ? "dark" : "light");

/* ---------- منوی موبایل ---------- */
const menuToggle = $("#menu-toggle"), mainNav = $("#main-nav");
function setMenu(open) {
  if (!menuToggle || !mainNav) return;
  const isOpen = mobile.matches && open;
  mainNav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? menuToggle.dataset.labelClose : menuToggle.dataset.labelOpen);
}
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));
  mainNav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav.classList.contains("is-open")) { setMenu(false); menuToggle.focus(); }
  });
  mobile.addEventListener("change", () => setMenu(false));
}

/* ---------- کپی ایمیل ---------- */
const copyBtn = $("#copy-email"), copyStatus = $("#copy-status");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.dataset.email;
    let ok = false;
    try { await navigator.clipboard.writeText(email); ok = true; } catch (_) {}
    copyStatus.textContent = ok ? copyBtn.dataset.copied : copyBtn.dataset.failed;
    setTimeout(() => { copyStatus.textContent = ""; }, 3000);
  });
}

/* ---------- سال فوتر ---------- */
const year = $("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

/* ---------- مکث انیمیشن لوگو وقتی از دید خارج است ---------- */
const heroArt = $(".hero-art");
if (heroArt && "IntersectionObserver" in window) {
  new IntersectionObserver(([en]) => heroArt.classList.toggle("is-paused", !en.isIntersecting)).observe(heroArt);
}

/* ---------- مشخص‌کردن بخش فعلی در منو ---------- */
const links = $$('.main-nav a[href^="#"]');
const targets = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
if (targets.length && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  targets.forEach((t) => spy.observe(t));
}
