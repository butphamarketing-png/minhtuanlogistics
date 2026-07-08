(() => {
  const phone = "0938961012";
  const email = "contact@minhtuan.vn";
  const LOADER_DURATION = 4000;
  const pageLoader = document.getElementById("pageLoader");

  window.setTimeout(() => {
    if (!pageLoader) return;
    pageLoader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    window.setTimeout(() => pageLoader.remove(), 700);
  }, LOADER_DURATION);

  /* Logo: xử lý nền đen trước khi hiện, tránh nháy */
  const removeLogoBackground = (imgEl) =>
    new Promise((resolve) => {
      const source = imgEl.getAttribute("src");
      if (!source) return resolve();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve();
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
          imgEl.src = canvas.toDataURL("image/png");
        } catch (_) {
          /* Keep original source if processing fails */
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = source;
    });

  const logoImages = Array.from(document.querySelectorAll(".logo-image"));
  logoImages.forEach((imgEl) => {
    removeLogoBackground(imgEl);
  });

  /* Menu mobile */
  const menuToggle = document.getElementById("menuToggle");
  const mainMenu = document.getElementById("mainMenu");
  const menuOverlay = document.getElementById("menuOverlay");
  const siteHeader = document.getElementById("siteHeader");

  const openMenu = () => {
    mainMenu.classList.add("is-open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Đóng menu");
    menuOverlay.hidden = false;
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    mainMenu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Mở menu");
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

  /* Header scroll shadow */
  if (siteHeader) {
    const onScroll = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
      "Yêu cầu tư vấn từ website Minh Tuấn",
      `Họ tên: ${name}`,
      `SĐT: ${phoneValue}`,
      `Nhu cầu: ${need}`,
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
        showNote("Vui lòng điền đầy đủ và đúng thông tin bắt buộc.", "error");
        return;
      }

      const message = buildMessage(name, phoneValue, need);
      const encoded = encodeURIComponent(message);

      if (channel === "zalo") {
        window.open(`https://zalo.me/${phone}?text=${encoded}`, "_blank", "noopener");
        showNote("Đã mở Zalo. Vui lòng gửi tin nhắn để hoàn tất.", "success");
        return;
      }

      const subject = encodeURIComponent("Yêu cầu tư vấn - Minh Tuấn");
      window.location.href = `mailto:${email}?subject=${subject}&body=${encoded}`;
      showNote("Đã mở ứng dụng Email. Vui lòng nhấn Gửi để hoàn tất.", "success");
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
      { threshold: 0.12 }
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
      btn.setAttribute("aria-label", `Chuyển tới slide ${i + 1}`);
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
