"use strict";

const root = document.documentElement;
const $ = (s) => document.querySelector(s);
const themeToggle = $("#theme-toggle"), themeIcon = $("#theme-icon"), languageToggle = $("#language-toggle");
const menuToggle = $("#menu-toggle"), mainNav = $("#main-nav");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobileQuery = matchMedia("(max-width: 700px)");

const copy = {
  fa: {
    title: "فرحناز اصغرپور | طراح وب و فرانت‌اند مبتدی، جویای کارآموزی",
    metaDescription: "پورتفولیوی فرحناز اصغرپور؛ علاقه‌مند به طراحی وب و فرانت‌اند با HTML، CSS و JavaScript، جویای فرصت کارآموزی در تهران.",
    skipLink: "رفتن به محتوای اصلی", brand: "فرحناز اصغرپور", navLabel: "منوی اصلی", navHome: "خانه", navProjects: "نمونه‌کار", navAbout: "مهارت‌ها", navExperience: "سوابق", navContact: "تماس",
    themeAria: "تغییر تم", menuOpenAria: "باز کردن منو", menuCloseAria: "بستن منو",
    eyebrow: "فرانت‌اند مبتدی · جویای کارآموزی", heroHello: "سلام، من فرحناز هستم،", heroTitle: "در حال یادگیری فرانت‌اند و ساخت صفحه‌های وب هستم.",
    heroDescription: "با HTML، CSS و JavaScript پروژه‌های کوچک می‌سازم و دنبال یک فرصت کارآموزی هستم تا در کنار یک تیم حرفه‌ای رشد کنم.",
    viewProjects: "مشاهده نمونه‌کار", contactMe: "تماس با من", skillTagline: "همیشه در حال یادگیری",
    projectsEyebrow: "نمونه‌کار", projectsTitle: "نمونه‌کارها", projectsDescription: "پروژه‌هایی که با تمرین و یادگیری ساخته‌ام.",
    projectTitle: "رادمهر گروپ", projectDescription: "وب‌سایت حوزه ساختمان و املاک با هویت بصری لوکس و طراحی واکنش‌گرا.", projectType: "طراحی وب‌سایت", project2Title: "پورتفولیوی شخصی", project2Description: "طراحی این وب‌سایت شخصی با تمرکز بر معرفی مهارت‌ها، مسیر یادگیری و نمونه‌کارها.", project2Type: "طراحی رابط کاربری", project3Title: "فیلتر محصولات", project3Description: "تمرین تعاملی فرانت‌اند برای نمایش محصولات، جست‌وجو، دسته‌بندی و مرتب‌سازی.", project3Type: "تمرین JavaScript",
    aboutEyebrow: "درباره من", aboutTitle: "در مسیر یادگیری، با تمرکز بر کیفیت.", aboutDescription: "لیسانس برق الکترونیک دارم و چند دورهٔ HTML/CSS و JavaScript گذرانده‌ام. اکنون دنبال کارآموزی‌ام تا مهارت‌هایم را در پروژه‌های واقعی تقویت کنم.",
    skillsTitle: "مهارت‌ها", skillResp: "طراحی واکنش‌گرا", skillUx: "مبانی UI/UX", langEnglish: "زبان انگلیسی",
    expTitle: "سابقه کاری", job2Title: "طراح وب | استارتاپ تک وب", job2Date: "۱۳۹۸ – ۱۳۹۹", job2Desc: "طراحی رابط کاربری و ساخت صفحه‌های فرود با HTML/CSS و جاوااسکریپت.",
    eduTitle: "تحصیلات و دوره‌ها", edu1Title: "لیسانس برق الکترونیک | دانشگاه آزاد کرج", edu1Date: "۱۳۸۷ – ۱۳۹۱", eduYear: "۱۴۰۳",
    edu3Title: "دوره تخصصی JavaScript | وب‌آکادمی", edu4Title: "دوره پیشرفته HTML/CSS | ارقام انفورماتیک",
    contactEyebrow: "ارتباط", contactTitle: "به‌دنبال فرصت کارآموزی هستم.", contactDescription: "اگر تیمی برای کارآموزی فرانت‌اند دارید، خوشحال می‌شوم با من در ارتباط باشید.",
    emailCta: "ارسال ایمیل", location: "تهران، ایران", copyright: "تمام حقوق محفوظ است.", backTop: "بازگشت به بالا ↑"
  },
  en: {
    title: "Farahnaz Asgharpour | Junior Web Designer & Front-End Developer",
    metaDescription: "Portfolio of Farahnaz Asgharpour, a junior web designer and front-end developer in Tehran learning HTML, CSS and JavaScript and looking for an internship.",
    skipLink: "Skip to main content", brand: "Farahnaz Asgharpour", navLabel: "Main navigation", navHome: "Home", navProjects: "Work", navAbout: "Skills", navExperience: "Experience", navContact: "Contact",
    themeAria: "Toggle color theme", menuOpenAria: "Open menu", menuCloseAria: "Close menu",
    eyebrow: "Junior front-end · Seeking an internship", heroHello: "Hi, I'm Farahnaz,", heroTitle: "learning front-end development and building web pages.",
    heroDescription: "I build small projects with HTML, CSS and JavaScript, and I'm looking for an internship to grow alongside a professional team.",
    viewProjects: "View my work", contactMe: "Contact me", skillTagline: "Always learning.",
    projectsEyebrow: "Work", projectsTitle: "Selected projects", projectsDescription: "Projects built through practice and continuous learning.",
    projectTitle: "Radmehr Group", projectDescription: "A construction and real-estate website with a luxury visual identity and responsive design.", projectType: "Website design", project2Title: "Personal Portfolio", project2Description: "This personal website introduces my skills, learning journey and selected work.", project2Type: "UI design", project3Title: "Product Filter", project3Description: "An interactive front-end exercise for product display, search, categories and sorting.", project3Type: "JavaScript practice",
    aboutEyebrow: "About me", aboutTitle: "Still learning, focused on quality.", aboutDescription: "I hold a B.Sc. in Electronics Engineering and have completed courses in HTML/CSS and JavaScript. Now I'm looking for an internship to strengthen my skills on real projects.",
    skillsTitle: "Skills", skillResp: "Responsive design", skillUx: "UI/UX basics", langEnglish: "English",
    expTitle: "Work experience", job2Title: "Web Designer | Tak Web Startup", job2Date: "2019 – 2020", job2Desc: "Designed interfaces and built landing pages with HTML/CSS and JavaScript.",
    eduTitle: "Education & courses", edu1Title: "B.Sc. Electronics Engineering | Azad University, Karaj", edu1Date: "2008 – 2012", eduYear: "2024",
    edu3Title: "JavaScript course | WebAcademy", edu4Title: "Advanced HTML/CSS course | Arghaam Informatics",
    contactEyebrow: "Contact", contactTitle: "Looking for an internship.", contactDescription: "If your team offers a front-end internship, I'd be glad to hear from you.",
    emailCta: "Send an email", location: "Tehran, Iran", copyright: "All rights reserved.", backTop: "Back to top ↑"
  }
};

const safeRead = (k, f) => { try { return localStorage.getItem(k) || f; } catch (_) { return f; } };
const safeSave = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };

let language = safeRead("portfolio-language", "fa");
if (!copy[language]) language = "fa";
let theme = root.dataset.theme === "dark" ? "dark" : "light";

function setMeta(selector, attr, value) { const el = $(selector); if (el) el.setAttribute(attr, value); }

function applyTheme(next) {
  theme = next;
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  setMeta('meta[name="theme-color"]', "content", theme === "dark" ? "#17132f" : "#f5f2ff");
  safeSave("portfolio-theme", theme);
}

function applyLanguage(next) {
  language = next;
  const fa = language === "fa", dict = copy[language];
  root.lang = language; root.dir = fa ? "rtl" : "ltr";
  document.title = dict.title;
  setMeta('meta[name="description"]', "content", dict.metaDescription);
  setMeta('meta[property="og:locale"]', "content", fa ? "fa_IR" : "en_US");
  document.querySelectorAll("[data-i18n]").forEach((el) => { const v = dict[el.dataset.i18n]; if (v !== undefined) el.textContent = v; });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { const v = dict[el.dataset.i18nAria]; if (v !== undefined) el.setAttribute("aria-label", v); });
  languageToggle.textContent = fa ? "EN" : "fa";
  languageToggle.lang = fa ? "en" : "fa";
  languageToggle.setAttribute("aria-label", fa ? "Switch language to English" : "تغییر زبان به فارسی");
  setMenu(false);
  safeSave("portfolio-language", language);
}

function setMenu(open) {
  const isOpen = mobileQuery.matches && open;
  mainNav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? copy[language].menuCloseAria : copy[language].menuOpenAria);
}

themeToggle.addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));
languageToggle.addEventListener("click", () => applyLanguage(language === "fa" ? "en" : "fa"));
menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("is-open")));
mainNav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && mainNav.classList.contains("is-open")) { setMenu(false); menuToggle.focus(); } });
mobileQuery.addEventListener("change", () => setMenu(false));
$("#current-year").textContent = String(new Date().getFullYear());

/* Pause the logo animation while the hero is off-screen (saves CPU/battery) */
const heroArt = $(".hero-art");
if (heroArt && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => heroArt.classList.toggle("is-paused", !entry.isIntersecting)).observe(heroArt);
}

function initSmoothScroll() {
  if (reducedMotion.matches || !window.Lenis) return;
  try {
    const lenis = new Lenis({ anchors: true, smoothWheel: true });
    if (window.gsap) {
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  } catch (err) { console.warn("Smooth scroll unavailable; using native scrolling.", err); }
}

/* Scroll reveal: plain IntersectionObserver + CSS (no ScrollTrigger needed) */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  items.forEach((el) => io.observe(el));
}

function initAnimations() {
  if (reducedMotion.matches || !window.gsap) return;
  gsap.from(".hero-copy > *", { opacity: 0, y: 18, duration: 0.75, stagger: 0.09, ease: "power2.out", clearProps: "all" });
}

applyTheme(theme);
applyLanguage(language);
initSmoothScroll();
initReveal();
initAnimations();
