(() => {
  const phone = "0938961012";
  const email = "contact@minhtuan.vn";
  const LOADER_KEY = "mt_logistics_seen";
  const LOADER_DURATION = 2200;
  const pageLoader = document.getElementById("pageLoader");
  const menuLabel = (key) => (window.I18N ? window.I18N.t(key) : key);

  if (pageLoader && sessionStorage.getItem(LOADER_KEY)) {
    pageLoader.remove();
    document.body.classList.remove("is-loading");
  } else if (pageLoader) {
    sessionStorage.setItem(LOADER_KEY, "1");
    window.setTimeout(() => {
      pageLoader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      window.setTimeout(() => pageLoader.remove(), 700);
    }, LOADER_DURATION);
  } else {
    document.body.classList.remove("is-loading");
  }

  /* Scroll progress */
  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  scrollProgress.setAttribute("aria-hidden", "true");
  scrollProgress.innerHTML = "<span></span>";
  document.body.appendChild(scrollProgress);
  const scrollProgressBar = scrollProgress.firstElementChild;

  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    scrollProgressBar.style.width = `${ratio * 100}%`;
  };

  /* Mobile call bar */
  const setupMobileCallBar = () => {
    if (!window.matchMedia("(max-width: 1024px)").matches) return;
    if (document.querySelector(".mobile-call-bar")) return;

    const bar = document.createElement("div");
    bar.className = "mobile-call-bar";
    bar.innerHTML = `
      <div>
        <small data-i18n="mobile.call_sub">Tư vấn logistics 24/7</small>
        <strong>0938 961 012</strong>
      </div>
      <a href="tel:${phone}">
        <span aria-hidden="true">☎</span>
        <span data-i18n="mobile.call_now">Gọi ngay</span>
      </a>
    `;
    document.body.appendChild(bar);
    document.body.classList.add("has-mobile-call-bar");
    window.I18N?.apply?.(bar);
  };

  setupMobileCallBar();

  const FLOAT_ICONS = {
    phone:
      '<svg class="float-btn-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 4.8c.4-1 1.6-1.3 2.4-.5l1.6 1.6c.7.7.8 1.8.2 2.6l-1 1.3c1.2 2.1 3.1 4 5.2 5.2l1.3-1c.8-.6 1.9-.5 2.6.2l1.6 1.6c.8.8.5 2-.5 2.4-1.3.5-2.7.7-4.1.4-3.5-.8-6.7-3.1-9.1-6.4-.8-1.1-1.2-2.4-1-3.8Z"/></svg>',
    zalo:
      '<svg class="float-btn-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H9.2L5 19.8v-3.3H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z"/><path d="M8.2 10.8h7.6M8.2 14h4.8"/><path d="M13.8 10.8V14"/></svg>',
    messenger:
      '<svg class="float-btn-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c-4.8 0-8.7 3.2-8.7 7.2 0 2.3 1.2 4.4 3.1 5.8L5.2 21l4.6-2.4c.8.2 1.6.3 2.4.3 4.8 0 8.7-3.2 8.7-7.2S16.8 2.8 12 2.8Z"/><path class="float-btn-ico-fill" d="m10.4 8.2 5.2 4.1-3.6 1.4 1.4 3.9 4.1-5.1-3.6-1.4 1.1-2.9Z"/></svg>',
    chat:
      '<svg class="float-btn-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14a1.8 1.8 0 0 1 1.8 1.8v8.4A1.8 1.8 0 0 1 19 18.5H9.6L6 21.2v-2.7H5A1.8 1.8 0 0 1 3.2 16.7V8.3A1.8 1.8 0 0 1 5 6.5Z"/><path d="M8.2 11h7.6M8.2 13.8h5.2"/></svg>',
    top:
      '<svg class="float-btn-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18.5V7.2"/><path d="m7.8 11 4.2-4.2L16.2 11"/></svg>',
  };

  const initFloatingContact = () => {
    let wrap = document.querySelector(".floating-contact");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "floating-contact";
      document.body.appendChild(wrap);
    }

    const chatHref = document.getElementById("contact") ? "#contact" : "lien-he.html";

    wrap.innerHTML = `
      <span class="float-sparkle float-sparkle--1" aria-hidden="true"></span>
      <span class="float-sparkle float-sparkle--2" aria-hidden="true"></span>
      <span class="float-sparkle float-sparkle--3" aria-hidden="true"></span>
      <a class="float-btn call float-btn--glow" href="tel:${phone}" data-i18n-aria="aria.call" data-i18n-title="aria.call" title="${menuLabel("aria.call")}">
        <span class="float-btn-shine" aria-hidden="true"></span>
        ${FLOAT_ICONS.phone}
      </a>
      <a class="float-btn zalo float-btn--glow" href="https://zalo.me/${phone}" target="_blank" rel="noopener" data-i18n-aria="aria.zalo" data-i18n-title="aria.zalo" title="${menuLabel("aria.zalo")}">
        <span class="float-btn-shine" aria-hidden="true"></span>
        ${FLOAT_ICONS.zalo}
      </a>
      <a class="float-btn messenger float-btn--glow" href="https://m.me/" target="_blank" rel="noopener" data-i18n-aria="aria.messenger" data-i18n-title="aria.messenger" title="${menuLabel("aria.messenger")}">
        <span class="float-btn-shine" aria-hidden="true"></span>
        ${FLOAT_ICONS.messenger}
      </a>
      <a class="float-btn chat float-btn--glow" href="${chatHref}" data-i18n-aria="aria.live_chat" data-i18n-title="aria.live_chat" title="${menuLabel("aria.live_chat")}">
        <span class="float-btn-shine" aria-hidden="true"></span>
        ${FLOAT_ICONS.chat}
      </a>
      <button class="float-btn top" id="backToTop" type="button" data-i18n-aria="aria.back_top" data-i18n-title="aria.back_top" title="${menuLabel("aria.back_top")}">
        <span class="float-btn-shine" aria-hidden="true"></span>
        ${FLOAT_ICONS.top}
      </button>
    `;

    window.I18N?.apply?.(wrap);
  };

  initFloatingContact();

  /* Image performance helpers */
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("decoding")) img.decoding = "async";
    if (img.complete) img.classList.add("is-loaded");
    else {
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
      img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });
    }
  });

  /* Logo: xóa nền đen, dùng chung cho loader và header */
  const processLogoSource = (source) =>
    new Promise((resolve) => {
      if (!source) return resolve(source);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(source);
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const isNearBlack = r < 40 && g < 40 && b < 40;
            const isDarkGray = r < 58 && g < 58 && b < 58 && Math.abs(r - g) < 16 && Math.abs(g - b) < 16;
            if (isNearBlack) {
              data[i + 3] = 0;
            } else if (isDarkGray) {
              data[i + 3] = Math.min(data[i + 3], 70);
            }
          }
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (_) {
          resolve(source);
        }
      };
      img.onerror = () => resolve(source);
      img.src = source;
    });

  const applyLogoEverywhere = (processedSrc) => {
    const loaderLogo = document.querySelector(".page-loader-logo");
    if (loaderLogo) {
      loaderLogo.src = processedSrc;
      loaderLogo.classList.remove("is-processing");
      loaderLogo.classList.add("is-ready");
    }
    document.querySelectorAll(".logo-image").forEach((imgEl) => {
      imgEl.src = processedSrc;
    });
  };

  const loaderLogo = document.querySelector(".page-loader-logo");
  const headerLogo = document.querySelector(".logo-image");
  const logoSource =
    loaderLogo?.getAttribute("src") || headerLogo?.getAttribute("src") || "/logo.png";

  if (loaderLogo) loaderLogo.classList.add("is-processing");

  processLogoSource(logoSource).then(applyLogoEverywhere);

  /* Menu mobile */
  const menuToggle = document.getElementById("menuToggle");
  const mainMenu = document.getElementById("mainMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const siteHeader = document.getElementById("siteHeader");

  const openMenu = () => {
    mainMenu.classList.add("is-open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", menuLabel("aria.close_menu"));
    menuOverlay.hidden = false;
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    mainMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", menuLabel("aria.open_menu"));
    menuOverlay.hidden = true;
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && mainMenu && menuOverlay) {
    menuToggle.addEventListener("click", () => {
      if (mainMenu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    menuOverlay.addEventListener("click", closeMenu);

    mainMenu.addEventListener("click", (e) => {
      const parentLink = e.target.closest(".has-dropdown > .nav-parent");
      if (parentLink && window.matchMedia("(max-width: 1024px)").matches) {
        const item = parentLink.parentElement;
        if (!item.classList.contains("is-open")) {
          e.preventDefault();
          mainMenu.querySelectorAll(".has-dropdown.is-open").forEach((el) => {
            if (el !== item) el.classList.remove("is-open");
          });
          item.classList.add("is-open");
          return;
        }
      }

      const link = e.target.closest("a");
      if (link) closeMenu();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  window.addEventListener("localechange", () => {
    if (menuToggle && !mainMenu?.classList.contains("is-open")) {
      menuToggle.setAttribute("aria-label", menuLabel("aria.open_menu"));
    }
    document.querySelectorAll(".mobile-call-bar [data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = menuLabel(key);
    });
    document.querySelectorAll(".floating-contact [data-i18n-aria], .floating-contact [data-i18n-title]").forEach((el) => {
      const ariaKey = el.getAttribute("data-i18n-aria");
      const titleKey = el.getAttribute("data-i18n-title");
      if (ariaKey) el.setAttribute("aria-label", menuLabel(ariaKey));
      if (titleKey) el.title = menuLabel(titleKey);
    });
  });

  /* Header scroll shadow */
  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
      siteHeader.classList.toggle("is-compact", window.scrollY > 120);
      updateScrollProgress();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  } else {
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
  }

  /* Contact form */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  const showNote = (message, type) => {
    if (!formNote) return;
    formNote.hidden = false;
    formNote.textContent = message;
    formNote.className = `form-note ${type}`;
  };

  const clearInvalid = () => {
    contactForm?.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  };

  const validate = (name, phoneValue, need) => {
    clearInvalid();
    let valid = true;
    if (!name.trim()) {
      contactForm.name.classList.add("is-invalid");
      valid = false;
    }
    const phoneDigits = phoneValue.replace(/\D/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      contactForm.phone.classList.add("is-invalid");
      valid = false;
    }
    if (!need.trim()) {
      contactForm.need.classList.add("is-invalid");
      valid = false;
    }
    return valid;
  };

  const buildMessage = (name, phoneValue, need) =>
    [
      menuLabel("msg.consult_request"),
      `${menuLabel("msg.name")}: ${name}`,
      `${menuLabel("msg.phone")}: ${phoneValue}`,
      `${menuLabel("msg.need")}: ${need}`,
    ].join("\n");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const submitter = event.submitter;
      const channel = submitter?.dataset.channel || "email";
      const name = contactForm.name.value.trim();
      const phoneValue = contactForm.phone.value.trim();
      const need = contactForm.need.value.trim();

      if (!validate(name, phoneValue, need)) {
        showNote(menuLabel("msg.form_error"), "error");
        return;
      }

      const message = buildMessage(name, phoneValue, need);
      const encoded = encodeURIComponent(message);

      if (channel === "zalo") {
        window.open(`https://zalo.me/${phone}?text=${encoded}`, "_blank", "noopener");
        showNote(menuLabel("msg.zalo_opened"), "success");
        return;
      }

      const subject = encodeURIComponent(menuLabel("msg.email_subject"));
      window.location.href = `mailto:${email}?subject=${subject}&body=${encoded}`;
      showNote(menuLabel("msg.email_opened"), "success");
    });
  }

  /* Reveal on scroll */
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  const workProcess = document.querySelector(".work-process");
  if (workProcess && "IntersectionObserver" in window) {
    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            workProcess.classList.add("is-active");
            processObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    processObserver.observe(workProcess);
  } else if (workProcess) {
    workProcess.classList.add("is-active");
  }

  /* Stats count-up from 0 */
  const statsBand = document.querySelector(".stats-band");
  const statItems = document.querySelectorAll(".stats-band [data-count]");

  const formatNumber = (value, format) => {
    if (format === "dot") {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return String(value);
  };

  const animateCount = (el, delay = 0) => {
    if (el.dataset.animated === "true") return;

    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const format = el.dataset.format || "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      el.dataset.animated = "true";
      el.textContent = `${formatNumber(target, format)}${suffix}`;
    };

    if (reducedMotion) {
      finish();
      return;
    }

    el.textContent = "0";

    window.setTimeout(() => {
      const duration = 2200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const current = Math.round(target * eased);
        el.textContent = `${formatNumber(current, format)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          finish();
        }
      };

      requestAnimationFrame(tick);
    }, delay);
  };

  const runStatsCountUp = () => {
    statItems.forEach((el, index) => animateCount(el, index * 150));
  };

  if (statsBand && statItems.length) {
    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runStatsCountUp();
            statsObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
      );
      statsObserver.observe(statsBand);
    } else {
      runStatsCountUp();
    }
  }

  /* Hero slideshow */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("slideDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const slideshow = document.getElementById("slideshow");
  let current = 0;
  let timer = null;
  const INTERVAL = 5000;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `${menuLabel("aria.slideshow")} ${i + 1}`);
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(btn);
    });
  }

  const dots = () => Array.from(dotsWrap?.querySelectorAll("button") || []);

  const render = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });
    dots().forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
    });
  };

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    render();
    restart();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (slides.length <= 1) return;
    stop();
    timer = setInterval(next, INTERVAL);
  };

  const restart = () => start();

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  let touchX = 0;
  slideshow?.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
      stop();
    },
    { passive: true }
  );
  slideshow?.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next();
        else prev();
      } else {
        start();
      }
    },
    { passive: true }
  );

  slideshow?.addEventListener("mouseenter", stop);
  slideshow?.addEventListener("mouseleave", start);

  if (slides.length) {
    render();
    start();
  }

  /* Testimonials slider */
  const track = document.getElementById("testimonialTrack");
  const dotsBox = document.getElementById("testimonialDots");
  const slider = document.getElementById("testimonialSlider");
  const tCards = Array.from(track?.children || []);
  let tIndex = 0;
  let tTimer = null;
  let perView = 3;

  const getPerView = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, tCards.length - perView);

  const renderTestimonials = () => {
    if (!track) return;
    const gap = 20;
    const cardWidth = tCards[0]?.getBoundingClientRect().width || 0;
    const offset = tIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    Array.from(dotsBox?.children || []).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === tIndex);
    });
  };

  const buildDots = () => {
    if (!dotsBox) return;
    dotsBox.innerHTML = "";
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Testimonials page ${i + 1}`);
      if (i === tIndex) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        tIndex = i;
        renderTestimonials();
        restartTestimonials();
      });
      dotsBox.appendChild(btn);
    }
  };

  const nextTestimonials = () => {
    tIndex = tIndex >= maxIndex() ? 0 : tIndex + 1;
    renderTestimonials();
  };

  const stopTestimonials = () => {
    if (tTimer) clearInterval(tTimer);
    tTimer = null;
  };

  const startTestimonials = () => {
    stopTestimonials();
    tTimer = setInterval(nextTestimonials, 5000);
  };

  const restartTestimonials = () => startTestimonials();

  const setupTestimonials = () => {
    perView = getPerView();
    tIndex = Math.min(tIndex, maxIndex());
    buildDots();
    renderTestimonials();
  };

  if (track && tCards.length) {
    setupTestimonials();
    startTestimonials();
    window.addEventListener("resize", setupTestimonials);

    let touchStartX = 0;
    slider?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
        stopTestimonials();
      },
      { passive: true }
    );
    slider?.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) nextTestimonials();
          else tIndex = tIndex <= 0 ? maxIndex() : tIndex - 1;
          renderTestimonials();
        }
        startTestimonials();
      },
      { passive: true }
    );

    slider?.addEventListener("mouseenter", stopTestimonials);
    slider?.addEventListener("mouseleave", startTestimonials);
  }

  /* CTA parallax */
  const ctaMedia = document.getElementById("ctaMedia");
  ctaMedia?.addEventListener("mousemove", (e) => {
    const rect = ctaMedia.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const img = ctaMedia.querySelector("img");
    if (img) img.style.transform = `scale(1.04) translate(${x * 10}px, ${y * 8}px)`;
    ctaMedia.querySelectorAll(".cta-float").forEach((el, i) => {
      const depth = 0.04 + i * 0.02;
      el.style.transform = `translate(${x * depth * 40}px, ${y * depth * 40}px)`;
    });
  });
  ctaMedia?.addEventListener("mouseleave", () => {
    const img = ctaMedia.querySelector("img");
    if (img) img.style.transform = "";
    ctaMedia.querySelectorAll(".cta-float").forEach((el) => {
      el.style.transform = "";
    });
  });

  /* Back to top */
  const backToTop = document.getElementById("backToTop");
  const onTopScroll = () => {
    if (!backToTop) return;
    if (window.scrollY > 420) backToTop.classList.add("is-visible");
    else backToTop.classList.remove("is-visible");
  };
  onTopScroll();
  window.addEventListener("scroll", onTopScroll, { passive: true });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
