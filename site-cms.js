(() => {
  const setText = (sel, text) => {
    if (!text && text !== 0) return;
    document.querySelectorAll(sel).forEach((el) => {
      el.textContent = text;
    });
  };

  const setAttr = (sel, attr, val) => {
    if (!val) return;
    document.querySelectorAll(sel).forEach((el) => {
      el.setAttribute(attr, val);
    });
  };

  const applySettings = (s) => {
    if (!s) return;
    document.querySelectorAll(".topbar-chip").forEach((el, i) => {
      const mod = i % 3;
      if (mod === 0) el.textContent = `Hotline: ${s.hotline}`;
      else if (mod === 1) el.textContent = s.address;
      else el.textContent = s.email;
    });

    setText(".footer-col-brand h3", s.company);
    setText(".footer-desc", s.footer?.desc || s.company);
    setText(".footer-bottom p", s.footer?.copyright);

    const contactItems = document.querySelectorAll(".footer-contact li span");
    if (contactItems.length >= 5) {
      contactItems[0].textContent = s.hotline;
      contactItems[1].textContent = s.address;
      contactItems[2].textContent = s.email;
      contactItems[3].textContent = s.website;
      contactItems[4].textContent = s.workingHours;
    }

    document.querySelectorAll(".nav-cta, .mobile-call-bar a[href^='tel']").forEach((el) => {
      el.href = `tel:${s.phone || s.hotline?.replace(/\D/g, "")}`;
    });
    document.querySelectorAll(".nav-cta").forEach((el) => {
      const textNode = [...el.childNodes].find((n) => n.nodeType === 3 || (n.nodeType === 1 && !n.classList?.contains("hotline-ico")));
      if (textNode?.nodeType === 1) textNode.textContent = s.hotline;
      else if (el.lastChild?.nodeType === 3) el.lastChild.textContent = s.hotline;
    });

    const social = s.social || {};
    const socialLinks = document.querySelectorAll(".footer-social a");
    const socialUrls = [social.facebook, social.zalo, `mailto:${s.email}`, social.linkedin];
    socialLinks.forEach((a, i) => {
      if (socialUrls[i]) a.href = socialUrls[i];
    });

    if (s.logo) {
      document.querySelectorAll(".logo-image").forEach((img) => {
        img.src = s.logo;
      });
    }

    if (s.seo?.homeTitle && document.body.dataset.page === "home") {
      document.title = s.seo.homeTitle;
    }

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc && s.seo?.homeDescription && document.body.dataset.page === "home") {
      metaDesc.content = s.seo.homeDescription;
    }

    window.SITE_SETTINGS = s;
    window.SEO?.apply?.({ webPage: true });
  };

  const applyHomepage = (h) => {
    if (!h) return;

    document.querySelectorAll("#slides .slide img").forEach((img, i) => {
      const sl = h.heroSlides?.[i];
      if (!sl) return;
      img.src = sl.src;
      img.alt = sl.alt || img.alt;
    });

    document.querySelectorAll("[data-count]").forEach((el, i) => {
      const st = h.stats?.[i];
      if (!st) return;
      el.dataset.count = st.value;
      el.dataset.suffix = st.suffix || "";
      if (st.format) el.dataset.format = st.format;
      el.textContent = "0";
    });

    if (h.hero) {
      setText(".hero-brand", h.hero.brand);
      setText(".hero-headline-line:not(.hero-headline-line--accent)", h.hero.headline1);
      setText(".hero-headline-line--accent", h.hero.headline2);
      setText(".hero-lead", h.hero.lead);
    }

    document.querySelectorAll(".service-cover-card").forEach((card, i) => {
      const svc = h.services?.[i];
      if (!svc) return;
      const img = card.querySelector("img");
      const title = card.querySelector("h3");
      const link = card.querySelector(".service-arrow");
      if (img) {
        img.src = svc.image;
        img.alt = svc.alt || svc.title;
      }
      if (title) title.textContent = svc.title;
      if (link && svc.link) link.href = svc.link;
    });

    document.querySelectorAll(".why-radial-label").forEach((label, i) => {
      const w = h.whyChoose?.[i];
      if (w?.title) label.textContent = w.title;
    });

    document.querySelectorAll(".timeline-step").forEach((step, i) => {
      const p = h.process?.[i];
      if (!p) return;
      const t = step.querySelector("h3");
      const tx = step.querySelector("p");
      if (t) t.textContent = p.title;
      if (tx) tx.textContent = p.text;
    });

    const track = document.getElementById("testimonialTrack");
    if (track && h.testimonials?.length) {
      const esc = (s) =>
        String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
      track.innerHTML = h.testimonials
        .map(
          (t) => `
        <article class="testimonial-card">
          <span class="quote-icon" aria-hidden="true">“</span>
          <div class="testimonial-user">
            <img src="${esc(t.avatar)}" alt="${esc(t.name)}" loading="lazy" />
            <div>
              <strong>${esc(t.name)}</strong>
              <span>${esc(t.role)}</span>
            </div>
          </div>
          <p>${esc(t.text)}</p>
        </article>`
        )
        .join("");
      document.dispatchEvent(new CustomEvent("testimonials-rebuilt"));
    }

    window.SITE_HOMEPAGE = h;
  };

  const applyGallery = (g) => {
    if (!g) return;
    const grid = document.querySelector(".subpage-gallery");
    if (grid && g.images?.length) {
      grid.innerHTML = g.images
        .map((img) => `<img src="${img.src}" alt="${img.alt || ""}" loading="lazy" />`)
        .join("");
    }
    if (g.videoUrl) {
      const videoSection = document.querySelector("#video .subpage-card, #video");
      if (videoSection && !videoSection.querySelector("iframe")) {
        const wrap = document.createElement("div");
        wrap.className = "cms-video-wrap";
        wrap.innerHTML = `<iframe src="${g.videoUrl}" title="Video" allowfullscreen loading="lazy"></iframe>`;
        videoSection.appendChild(wrap);
      }
    }
    window.SITE_GALLERY = g;
  };

  const applyPages = (pages) => {
    if (!pages) return;
    const page = document.body.dataset.page;
    if (!page || !pages[page]) return;
    const p = pages[page];
    const hero = document.querySelector(".subpage-hero");
    if (hero) {
      const h1 = hero.querySelector("h1");
      const desc = hero.querySelector("p");
      if (h1 && p.title) h1.textContent = p.title;
      if (desc && p.desc) desc.textContent = p.desc;
    }
    if (page === "about" && p.image) {
      const aboutImg = document.querySelector(".about-image-single img");
      if (aboutImg) aboutImg.src = p.image;
    }
    if (page === "projects") {
      const cards = document.querySelectorAll(".subpage-card p");
      if (cards[0] && p.featured) cards[0].textContent = p.featured;
      if (cards[1] && p.partners) cards[1].textContent = p.partners;
    }
    if (page === "gallery") {
      const videoCard = document.querySelector("#video h2");
      const videoText = document.querySelector("#video p");
      if (videoCard && p.videoTitle) videoCard.textContent = p.videoTitle;
      if (videoText && p.videoText) videoText.textContent = p.videoText;
    }
    window.SITE_PAGES = pages;
  };

  const loadNews = async (posts) => {
    const cmsNews = posts || (await fetch("/api/public/news").then((r) => (r.ok ? r.json() : null)).catch(() => null));
    if (cmsNews && cmsNews.length) {
      window.NEWS_POSTS = cmsNews;
      window.getNewsBySlug = (slug) => cmsNews.find((p) => p.slug === slug);
      window.getLatestNews = (n = 4) => cmsNews.slice().reverse().slice(0, n);
      return true;
    }
    return false;
  };

  window.SITE_CMS = {
    init: async () => {
      let data = null;
      try {
        const res = await fetch("/api/public/all", { cache: "no-store" });
        if (res.ok) data = await res.json();
      } catch (_) {}

      if (data) {
        applySettings(data.settings);
        applyHomepage(data.homepage);
        applyGallery(data.gallery);
        applyPages(data.pages);
        await loadNews(data.news);
      } else {
        applySettings(await fetch("/api/public/settings").then((r) => (r.ok ? r.json() : null)).catch(() => null));
        applyHomepage(await fetch("/api/public/homepage").then((r) => (r.ok ? r.json() : null)).catch(() => null));
        applyGallery(await fetch("/api/public/gallery").then((r) => (r.ok ? r.json() : null)).catch(() => null));
        applyPages(await fetch("/api/public/pages").then((r) => (r.ok ? r.json() : null)).catch(() => null));
        await loadNews();
      }

      document.dispatchEvent(new CustomEvent("cmsready"));
    },
  };

  const boot = () => window.SITE_CMS.init();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
