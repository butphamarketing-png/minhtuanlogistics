/**
 * Shared SEO head snippets for static HTML generators.
 */
const SITE_DEFAULT = "https://minhtuanlogistics.com";
const DEFAULT_OG = "/hero-slide-1.png";
const BRAND = "MINH TUẤN Logistics";

const HREFLANG = [
  { lang: "vi", param: null },
  { lang: "en", param: "en" },
  { lang: "zh-CN", param: "zh" },
  { lang: "x-default", param: null },
];

const absUrl = (siteUrl, pathOrUrl) => {
  const base = String(siteUrl || SITE_DEFAULT).replace(/\/$/, "");
  if (!pathOrUrl) return `${base}${DEFAULT_OG}`;
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("data:")) return pathOrUrl;
  return pathOrUrl.startsWith("/") ? `${base}${pathOrUrl}` : `${base}/${pathOrUrl}`;
};

const withLang = (url, param) => {
  if (!param) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}lang=${param}`;
};

/** Full i18n alternate set (main chrome pages). */
const hreflangLinks = (canonicalUrl, { multilingual = true } = {}) => {
  const url = String(canonicalUrl || "").replace(/\?lang=[^&]*&?/, "").replace(/[?&]$/, "");
  if (!multilingual) {
    return [
      `    <link rel="alternate" hreflang="vi" href="${url}" />`,
      `    <link rel="alternate" hreflang="x-default" href="${url}" />`,
    ].join("\n");
  }
  return HREFLANG.map(({ lang, param }) => {
    const href = withLang(url, param);
    return `    <link rel="alternate" hreflang="${lang}" href="${href}" />`;
  }).join("\n");
};

const ogLocaleTags = () =>
  [
    `    <meta property="og:locale" content="vi_VN" />`,
    `    <meta property="og:locale:alternate" content="en_US" />`,
    `    <meta property="og:locale:alternate" content="zh_CN" />`,
  ].join("\n");

const socialMeta = ({
  siteUrl = SITE_DEFAULT,
  title,
  description,
  url,
  image,
  type = "website",
  multilingual = true,
  extra = "",
}) => {
  const ogImage = absUrl(siteUrl, image || DEFAULT_OG);
  return `    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
${hreflangLinks(url, { multilingual })}
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:site_name" content="${BRAND}" />
${ogLocaleTags()}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
${extra}`;
};

const orgSchema = (siteUrl = SITE_DEFAULT) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
  alternateName: BRAND,
  url: siteUrl,
  logo: absUrl(siteUrl, "/logo.png"),
  email: "contact@minhtuan.vn",
  telephone: "+84938961012",
  address: {
    "@type": "PostalAddress",
    streetAddress: "69/1 Trần Quốc Hoàn, P. Tân Sơn Nhất",
    addressLocality: "TP. Hồ Chí Minh",
    addressRegion: "TP. Hồ Chí Minh",
    postalCode: "700000",
    addressCountry: "VN",
  },
  sameAs: [
    "https://facebook.com/",
    "https://zalo.me/0938961012",
    "https://linkedin.com/",
  ],
});

const localBusinessSchema = (siteUrl = SITE_DEFAULT) => ({
  "@context": "https://schema.org",
  "@type": "LogisticsService",
  name: "CÔNG TY TNHH XNK TM DV MINH TUẤN",
  url: siteUrl,
  telephone: "+84938961012",
  email: "contact@minhtuan.vn",
  image: absUrl(siteUrl, DEFAULT_OG),
  address: {
    "@type": "PostalAddress",
    streetAddress: "69/1 Trần Quốc Hoàn, P. Tân Sơn Nhất",
    addressLocality: "TP. Hồ Chí Minh",
    addressRegion: "TP. Hồ Chí Minh",
    postalCode: "700000",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 10.8014,
    longitude: 106.6526,
  },
  openingHours: "Mo-Sa 08:00-17:30",
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "TP. Hồ Chí Minh" },
    { "@type": "Country", name: "Việt Nam" },
  ],
});

const jsonLd = (id, data) =>
  `    <script type="application/ld+json" id="${id}">
${JSON.stringify(data)}
    </script>`;

module.exports = {
  SITE_DEFAULT,
  DEFAULT_OG,
  BRAND,
  absUrl,
  hreflangLinks,
  ogLocaleTags,
  socialMeta,
  orgSchema,
  localBusinessSchema,
  jsonLd,
};
