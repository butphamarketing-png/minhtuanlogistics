(() => {
  const DEFAULT_SITE_URL = "https://www.minhtuan.com";
  const BRAND = "MINH TUẤN Logistics";
  const DEFAULT_OG_IMAGE = "/logo.png";

  const PAGE_CONFIG = {
    home: { path: "/", titleKey: "meta.home.title", descKey: "meta.home.description", type: "website" },
    about: { path: "/gioi-thieu", titleKey: "meta.about.title", descKey: "meta.about.description", type: "website" },
    services: { path: "/dich-vu", titleKey: "meta.services.title", descKey: "meta.services.description", type: "website" },
    projects: { path: "/du-an", titleKey: "meta.projects.title", descKey: "meta.projects.description", type: "website" },
    news: { path: "/tin-tuc", titleKey: "meta.news.title", descKey: "meta.news.description", type: "website" },
    gallery: { path: "/hinh-anh", titleKey: "meta.gallery.title", descKey: "meta.gallery.description", type: "website" },
    contact: { path: "/lien-he", titleKey: "meta.contact.title", descKey: "meta.contact.description", type: "website" },
    article: { path: "/bai-viet", titleKey: null, descKey: null, type: "article" },
  };

  const LOCALE_OG = { vi: "vi_VN", en: "en_US", zh: "zh_CN" };

  const getSiteUrl = () => {
    const raw = window.SITE_SETTINGS?.siteUrl || window.SITE_SETTINGS?.website || DEFAULT_SITE_URL;
    const url = String(raw).trim();
    if (!url) return DEFAULT_SITE_URL;
    if (url.startsWith("http")) return url.replace(/\/$/, "");
    return `https://${url.replace(/^\/\//, "").replace(/\/$/, "")}`;
  };

  const getLocale = () => window.I18N?.getLocale?.() || "vi";

  const t = (key, fallback = "") => {
    if (!key) return fallback;
    return window.I18N?.t?.(key, fallback) || fallback;
  };

  const absUrl = (path) => {
    if (!path) return getSiteUrl();
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const base = getSiteUrl();
    return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
  };

  const upsertMeta = (attr, key, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  const upsertLink = (rel, href, extra = {}) => {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
  };

  const upsertJsonLd = (id, data) => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  };

  const getPageId = () => {
    const page = document.body?.dataset?.page;
    if (page) return page;
    const file = (window.location.pathname || "").split("/").pop() || "index.html";
    const map = {
      "index.html": "home",
      "gioi-thieu.html": "about",
      "dich-vu.html": "services",
      "du-an.html": "projects",
      "tin-tuc.html": "news",
      "hinh-anh.html": "gallery",
      "lien-he.html": "contact",
      "bai-viet.html": "article",
    };
    return map[file] || "home";
  };

  const getSettings = () => window.SITE_SETTINGS || {};

  const buildOrgSchema = () => {
    const s = getSettings();
    const social = s.social || {};
    const sameAs = [social.facebook, social.linkedin, social.zalo, social.messenger].filter(Boolean);
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: s.company || BRAND,
      url: getSiteUrl(),
      logo: absUrl(s.logo || DEFAULT_OG_IMAGE),
      email: s.email,
      telephone: s.phone || s.hotline?.replace(/\D/g, ""),
      address: s.address
        ? {
            "@type": "PostalAddress",
            streetAddress: s.address,
            addressLocality: "TP. Hồ Chí Minh",
            addressCountry: "VN",
          }
        : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    };
  };

  const buildLocalBusinessSchema = () => {
    const s = getSettings();
    const geo = { latitude: 10.8014, longitude: 106.6526 };
    return {
      "@context": "https://schema.org",
      "@type": "LogisticsService",
      name: s.company || BRAND,
      url: getSiteUrl(),
      telephone: s.phone || s.hotline,
      email: s.email,
      image: absUrl(s.logo || DEFAULT_OG_IMAGE),
      address: s.address
        ? {
            "@type": "PostalAddress",
            streetAddress: s.address,
            addressLocality: "TP. Hồ Chí Minh",
            addressRegion: "TP. Hồ Chí Minh",
            postalCode: "700000",
            addressCountry: "VN",
          }
        : undefined,
      geo: { "@type": "GeoCoordinates", ...geo },
      openingHours: s.workingHours,
      priceRange: "$$",
      areaServed: [
        { "@type": "City", name: "TP. Hồ Chí Minh" },
        { "@type": "Country", name: "Việt Nam" },
        { "@type": "Place", name: "ASEAN" },
        { "@type": "Place", name: "Quốc tế" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: t("services.title", "Dịch vụ Logistics"),
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: t("services.import_export", "Xuất nhập khẩu") } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: t("services.sea", "Vận chuyển đường biển") } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: t("services.air", "Vận chuyển hàng không") } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: t("services.domestic", "Vận chuyển đường bộ") } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: t("services.warehouse", "Kho bãi & Logistics") } },
        ],
      },
    };
  };

  const buildFaqSchema = () => {
    const items = document.querySelectorAll("[data-faq-item]");
    if (!items.length) return null;
    const mainEntity = [...items].map((el) => {
      const q = el.querySelector("[data-faq-q]");
      const a = el.querySelector("[data-faq-a]");
      if (!q || !a) return null;
      return {
        "@type": "Question",
        name: q.textContent.trim(),
        acceptedAnswer: { "@type": "Answer", text: a.textContent.trim() },
      };
    }).filter(Boolean);
    if (!mainEntity.length) return null;
    return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity };
  };

  const buildBreadcrumb = (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  });

  const applySocialMeta = ({ title, description, url, image, type = "website" }) => {
    const locale = getLocale();
    const ogLocale = LOCALE_OG[locale] || "vi_VN";
    const img = absUrl(image || getSettings().seo?.ogImage || DEFAULT_OG_IMAGE);

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", BRAND);
    upsertMeta("property", "og:locale", ogLocale);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);

    upsertMeta("name", "geo.region", "VN-SG");
    upsertMeta("name", "geo.placename", "TP. Hồ Chí Minh");
    upsertMeta("name", "geo.position", "10.8014;106.6526");
    upsertMeta("name", "ICBM", "10.8014, 106.6526");

    const keywords = getSettings().seo?.keywords;
    if (keywords) upsertMeta("name", "keywords", keywords);

    upsertLink("canonical", url);
  };

  const applyPage = (overrides = {}) => {
    const pageId = overrides.pageId || getPageId();
    const cfg = PAGE_CONFIG[pageId] || PAGE_CONFIG.home;
    const s = getSettings();

    let title = overrides.title;
    let description = overrides.description;

    if (!title) {
      if (pageId === "home" && s.seo?.homeTitle) title = s.seo.homeTitle;
      else if (cfg.titleKey) title = t(cfg.titleKey, document.title);
      else title = document.title;
    }

    if (!description) {
      if (pageId === "home" && s.seo?.homeDescription) description = s.seo.homeDescription;
      else if (cfg.descKey) description = t(cfg.descKey, "");
      else {
        const descEl = document.querySelector('meta[name="description"]');
        description = descEl?.getAttribute("content") || "";
      }
    }

    if (title) document.title = title;

    let url = overrides.url || getSiteUrl() + cfg.path;
    if (overrides.pathSuffix) url += overrides.pathSuffix;

    applySocialMeta({
      title,
      description,
      url,
      image: overrides.image,
      type: overrides.type || cfg.type,
    });

    upsertJsonLd("schema-org", buildOrgSchema());
    upsertJsonLd("schema-local-business", buildLocalBusinessSchema());

    if (pageId === "home") {
      upsertJsonLd("schema-website", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BRAND,
        url: getSiteUrl(),
        description,
        publisher: { "@type": "Organization", name: getSettings().company || BRAND },
        potentialAction: {
          "@type": "SearchAction",
          target: `${getSiteUrl()}/tin-tuc?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }

    const breadcrumbs = overrides.breadcrumbs;
    if (breadcrumbs?.length) {
      upsertJsonLd("schema-breadcrumb", buildBreadcrumb(breadcrumbs));
    } else if (pageId !== "home") {
      const pageName = title.split("|")[0]?.trim() || title;
      upsertJsonLd("schema-breadcrumb", buildBreadcrumb([
        { name: t("nav.home", "Trang chủ"), path: "/" },
        { name: pageName, path: cfg.path },
      ]));
    }

    if (overrides.webPage) {
      upsertJsonLd("schema-webpage", {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url,
        inLanguage: getLocale() === "zh" ? "zh-CN" : getLocale(),
        isPartOf: { "@type": "WebSite", name: BRAND, url: getSiteUrl() },
      });
    }

    if (pageId === "services") {
      const services = [
        { name: t("services.import_export", "Xuất nhập khẩu"), desc: t("page.services.xnk_text", "") },
        { name: t("services.sea", "Vận chuyển đường biển"), desc: t("page.services.sea_text", "") },
        { name: t("services.domestic", "Vận chuyển đường bộ"), desc: t("page.services.domestic_text", "") },
        { name: t("services.air", "Vận chuyển hàng không"), desc: t("page.services.air_text", "") },
        { name: t("services.warehouse", "Kho bãi & Logistics"), desc: t("page.services.warehouse_text", "") },
        { name: t("services.trade", "Thương mại"), desc: t("page.services.trade_text", "") },
        { name: t("services.consulting", "Tư vấn doanh nghiệp"), desc: t("page.services.consulting_text", "") },
      ];
      upsertJsonLd("schema-services", {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: t("page.services.title", "Dịch vụ"),
        itemListElement: services.map((svc, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: svc.name,
            description: svc.desc,
            provider: { "@type": "Organization", name: getSettings().company || BRAND },
            areaServed: "VN",
          },
        })),
      });
    }

    if (pageId === "contact") {
      const s = getSettings();
      upsertJsonLd("schema-contact", {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: title,
        description,
        url,
        mainEntity: {
          "@type": "Organization",
          name: s.company || BRAND,
          telephone: s.phone || s.hotline,
          email: s.email,
          url: getSiteUrl(),
        },
      });
    }

    if (pageId === "news") {
      upsertJsonLd("schema-blog", {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: t("page.news.title", "Tin tức Logistics"),
        description,
        url,
        publisher: { "@type": "Organization", name: getSettings().company || BRAND },
        inLanguage: getLocale() === "zh" ? "zh-CN" : getLocale(),
      });
    }

    const faqSchema = buildFaqSchema();
    if (faqSchema) upsertJsonLd("schema-faq", faqSchema);
  };

  const applyArticle = (post) => {
    if (!post) return;
    const title = `${post.title} | ${BRAND}`;
    const description = (post.metaDescription || post.excerpt || post.body?.[0] || "").slice(0, 160);
    const url = `${getSiteUrl()}/bai-viet?slug=${encodeURIComponent(post.slug)}`;
    const image = post.cover?.startsWith("data:") ? absUrl(DEFAULT_OG_IMAGE) : post.cover;

    document.title = title;
    applySocialMeta({ title, description, url, image, type: "article" });

    upsertMeta("property", "article:published_time", post.date);
    upsertMeta("property", "article:section", post.categoryLabel);

    upsertJsonLd("schema-org", buildOrgSchema());
    upsertJsonLd("schema-article", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image: [absUrl(image)],
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: getSettings().company || BRAND },
      publisher: {
        "@type": "Organization",
        name: getSettings().company || BRAND,
        logo: { "@type": "ImageObject", url: absUrl(DEFAULT_OG_IMAGE) },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.keyword,
    });

    upsertJsonLd("schema-breadcrumb", buildBreadcrumb([
      { name: t("nav.home", "Trang chủ"), path: "/" },
      { name: t("nav.news", "Tin tức"), path: "/tin-tuc" },
      { name: post.keyword, path: `/bai-viet?slug=${encodeURIComponent(post.slug)}` },
    ]));
  };

  const init = () => {
    if (getPageId() === "article") return;
    applyPage({ webPage: true });
  };

  window.SEO = { apply: applyPage, applyArticle, getSiteUrl, absUrl };

  document.addEventListener("localechange", () => {
    if (getPageId() === "article") return;
    applyPage({ webPage: true });
  });

  document.addEventListener("cmsready", () => {
    if (getPageId() === "article") return;
    applyPage({ webPage: true });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
