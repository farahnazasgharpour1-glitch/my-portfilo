"use strict";
/* گالری رادمهر — جاوااسکریپت خالص، بدون وابستگی.
   فقط در صفحه‌های مطالعهٔ موردی بارگذاری می‌شود (نه صفحهٔ اصلی).
   همهٔ متن‌ها از خود HTML خوانده می‌شوند؛ پس فارسی و انگلیسی یک کد مشترک دارند.

   پخش خودکار با انیمیشن CSS نوار پیشرفت هدایت می‌شود: وقتی انیمیشن تمام شد (animationend)
   تصویر بعدی نمایش داده می‌شود. چون مکث هم فقط animation-play-state را عوض می‌کند،
   نوار و تصویر همیشه هم‌زمان می‌مانند و هیچ setTimeout جداگانه‌ای وجود ندارد. */
(() => {
  const root = document.querySelector("[data-radmehr-gallery]");
  if (!root) return;

  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));

  const slides = $$("[data-gallery-slide]");
  const thumbs = $$("[data-gallery-thumb]");
  const total = slides.length;
  if (!total) return;

  const stage = $("[data-gallery-stage]");
  const thumbList = $("[data-gallery-thumbs]");
  const progress = $("[data-gallery-progress]");
  const toggle = $("[data-gallery-toggle]");
  const toggleLabel = $("[data-gallery-toggle-label]");
  const iconPause = $("[data-icon-pause]");
  const iconPlay = $("[data-icon-play]");
  const counter = $("[data-gallery-counter]");
  const captionIndex = $("[data-gallery-caption-index]");
  const captionTitle = $("[data-gallery-caption-title]");
  const status = $("[data-gallery-status]");
  const zoomButton = $("[data-gallery-zoom]");
  const dialog = $("[data-gallery-lightbox]");
  const lightboxImage = $("[data-gallery-lightbox-img]");
  const lightboxTitle = $("[data-gallery-lightbox-title]");
  const lightboxCounter = $("[data-gallery-lightbox-counter]");

  const data = root.dataset;
  const rtl = data.readingDir === "rtl";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fmt = new Intl.NumberFormat(data.numberLocale || "en", { minimumIntegerDigits: 2, useGrouping: false });
  const fmtPlain = new Intl.NumberFormat(data.numberLocale || "en", { useGrouping: false });
  const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

  const duration = Math.max(4000, Number(data.autoplay) || 7200);
  root.style.setProperty("--g-dur", duration + "ms");

  let index = 0;
  let autoplay = !reduced.matches;
  let userPaused = reduced.matches;
  let hovering = false;      // ماوس روی قاب تصویر
  let keyboardFocus = false; // فوکوس صفحه‌کلید داخل گالری
  let inView = false;
  let lightboxOpen = false;

  /* ---------- کمکی‌ها ---------- */
  const preload = (i) => {
    const image = $(".gallery-slide-main", slides[(i + total) % total]);
    if (image && image.loading !== "eager") image.loading = "eager";
  };

  const keepThumbVisible = (thumb) => {
    if (!thumb || !thumbList) return;
    const behavior = reduced.matches ? "auto" : "smooth";
    const horizontal = thumbList.scrollWidth > thumbList.clientWidth + 4 && thumbList.scrollHeight <= thumbList.clientHeight + 4;
    // فقط خودِ فهرست اسکرول می‌شود، نه صفحه (scrollIntoView صفحه را هم می‌پراند).
    if (horizontal) {
      const left = thumb.offsetLeft - (thumbList.clientWidth - thumb.offsetWidth) / 2;
      thumbList.scrollTo({ left, behavior });
    } else {
      const top = thumb.offsetTop - (thumbList.clientHeight - thumb.offsetHeight) / 2;
      thumbList.scrollTo({ top, behavior });
    }
  };

  const restartProgress = () => {
    if (!progress) return;
    root.classList.remove("is-autoplay");
    void progress.offsetWidth; // reflow تا انیمیشن از صفر شروع شود
    root.classList.toggle("is-autoplay", autoplay);
  };

  const refreshHold = () => {
    const held = !autoplay || userPaused || hovering || keyboardFocus || !inView || document.hidden || lightboxOpen;
    root.classList.toggle("is-held", held);
  };

  const refreshToggle = () => {
    if (!toggle) return;
    toggle.hidden = !autoplay && reduced.matches; // با کاهش حرکت، پخش خودکار اصلاً وجود ندارد
    toggle.setAttribute("aria-label", userPaused ? data.labelPlay : data.labelPause);
    if (toggleLabel) toggleLabel.textContent = userPaused ? data.textPlay : data.textPause;
    if (iconPause) iconPause.hidden = userPaused;
    if (iconPlay) iconPlay.hidden = !userPaused;
  };

  const syncLightbox = () => {
    if (!lightboxOpen || !dialog) return;
    const image = $(".gallery-slide-main", slides[index]);
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = slides[index].dataset.title || "";
    lightboxCounter.textContent = fill(data.countTemplate, { n: fmt.format(index + 1), total: fmt.format(total) });
  };

  /* ---------- نمایش یک تصویر ---------- */
  const go = (next, { announce = false } = {}) => {
    index = (next + total) % total;
    const title = slides[index].dataset.title || "";

    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    thumbs.forEach((thumb, i) => thumb.setAttribute("aria-current", String(i === index)));
    if (counter) counter.textContent = fill(data.countTemplate, { n: fmt.format(index + 1), total: fmt.format(total) });
    if (captionIndex) captionIndex.textContent = fmt.format(index + 1);
    if (captionTitle) captionTitle.textContent = title;

    preload(index + 1);
    if (announce) preload(index - 1); // تصویر قبلی فقط وقتی کاربر خودش حرکت می‌کند
    keepThumbVisible(thumbs[index]);
    restartProgress();
    refreshHold();
    syncLightbox();

    // خوانندهٔ صفحه فقط وقتی کاربر خودش تصویر را عوض کرده خبردار می‌شود، نه در هر تعویض خودکار.
    if (announce && status) {
      status.textContent = fill(data.statusTemplate, { n: fmtPlain.format(index + 1), total: fmtPlain.format(total), title });
    }
  };

  const step = (delta) => go(index + delta, { announce: true });

  /* ---------- رویدادها ---------- */
  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => go(i, { announce: true })));
  $$("[data-gallery-prev]").forEach((button) => button.addEventListener("click", () => step(-1)));
  $$("[data-gallery-next]").forEach((button) => button.addEventListener("click", () => step(1)));

  if (toggle) {
    toggle.addEventListener("click", () => {
      userPaused = !userPaused;
      refreshToggle();
      refreshHold();
    });
  }

  if (progress) {
    progress.addEventListener("animationend", () => { if (autoplay) go(index + 1); });
  }

  // مکث موقت فقط با ماوس واقعی؛ روی لمسی «hover» ماندگار می‌شود و پخش را برای همیشه می‌بندد.
  if (stage) {
    stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; refreshHold(); } });
    stage.addEventListener("pointerleave", () => { hovering = false; refreshHold(); });
  }
  root.addEventListener("focusin", (e) => {
    keyboardFocus = e.target.matches(":focus-visible");
    refreshHold();
  });
  root.addEventListener("focusout", () => { keyboardFocus = false; refreshHold(); });

  // کشیدن انگشت روی قاب تصویر (در RTL جهت برعکس است)
  if (stage) {
    let startX = 0, startY = 0, tracking = false;
    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || (e.pointerType === "mouse" && e.button !== 0)) return;
      tracking = true; startX = e.clientX; startY = e.clientY;
    });
    stage.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      step((rtl ? dx > 0 : dx < 0) ? 1 : -1);
    });
    stage.addEventListener("pointercancel", () => { tracking = false; });
  }

  // صفحه‌کلید: جهت فلش‌ها با جهت خواندن صفحه هماهنگ است
  root.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const inRail = e.target.closest("[data-gallery-thumbs]");
    let delta = 0;
    if (e.key === "ArrowRight") delta = rtl ? -1 : 1;
    else if (e.key === "ArrowLeft") delta = rtl ? 1 : -1;
    else if (inRail && e.key === "ArrowDown") delta = 1;
    else if (inRail && e.key === "ArrowUp") delta = -1;
    else if (e.key === "Home") { e.preventDefault(); go(0, { announce: true }); return; }
    else if (e.key === "End") { e.preventDefault(); go(total - 1, { announce: true }); return; }
    if (!delta) return;
    e.preventDefault();
    step(delta);
    if (inRail) thumbs[index].focus({ preventScroll: true });
  });

  /* ---------- نمای کامل (dialog بومی: Esc، تله‌ی فوکوس و بازگشت فوکوس را خود مرورگر انجام می‌دهد) ---------- */
  if (dialog && typeof dialog.showModal === "function" && zoomButton) {
    zoomButton.addEventListener("click", () => {
      lightboxOpen = true;
      syncLightbox();
      dialog.showModal();
      refreshHold();
    });
    dialog.addEventListener("close", () => { lightboxOpen = false; refreshHold(); });
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
    $("[data-gallery-close]", dialog).addEventListener("click", () => dialog.close());
  } else if (zoomButton) {
    zoomButton.hidden = true;
  }

  /* ---------- وضعیت محیط ---------- */
  document.addEventListener("visibilitychange", refreshHold);
  reduced.addEventListener("change", () => {
    autoplay = !reduced.matches;
    userPaused = reduced.matches;
    restartProgress();
    refreshToggle();
    refreshHold();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; refreshHold(); }, { threshold: 0.25 }).observe(root);
  } else {
    inView = true;
  }

  refreshToggle();
  go(0);
})();
