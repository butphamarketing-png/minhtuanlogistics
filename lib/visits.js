const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|headless|phantom|selenium|puppeteer|curl|wget|python-requests|go-http|scrapy/i;

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = String(forwarded).split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp) return String(realIp).trim();
  const cf = req.headers["cf-connecting-ip"];
  if (cf) return String(cf).trim();
  return req.socket?.remoteAddress || "unknown";
};

const getGeoFromHeaders = (req) => {
  const country =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    req.headers["x-country-code"] ||
    "";
  const city =
    req.headers["x-vercel-ip-city"] ||
    req.headers["x-city"] ||
    "";
  const region = req.headers["x-vercel-ip-country-region"] || "";
  const parts = [city, region, country]
    .map((p) => {
      try {
        return decodeURIComponent(String(p || "").trim());
      } catch {
        return String(p || "").trim();
      }
    })
    .filter(Boolean);
  return {
    country: String(country || "").trim(),
    city: String(city || "").trim(),
    location: parts.length ? parts.join(", ") : "",
  };
};

const scoreVisit = ({ ua = "", path = "", ip = "", recentCount = 0 }) => {
  const signals = [];
  let score = 0;

  if (BOT_UA.test(ua)) {
    score += 40;
    signals.push("Bot / crawler");
  }
  if (!ua || ua.length < 12) {
    score += 25;
    signals.push("UA trống / ngắn");
  }
  if (recentCount >= 20) {
    score += 35;
    signals.push("Tần suất cao");
  } else if (recentCount >= 8) {
    score += 18;
    signals.push("Nhiều request");
  }
  if (/\/wp-|\/\.env|\/phpmyadmin|\/xmlrpc|\/admin|\/cgi-bin/i.test(path)) {
    score += 30;
    signals.push("Đường dẫn lạ");
  }
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    score += 5;
    signals.push("IP local");
  }

  let level = "an toàn";
  if (score >= 55) level = "nghi ngờ";
  else if (score >= 25) level = "theo dõi";

  return { score, level, signals };
};

const normalizePath = (raw) => {
  try {
    if (!raw) return "/";
    if (raw.startsWith("http")) {
      const u = new URL(raw);
      return (u.pathname || "/") + (u.search || "");
    }
    return String(raw).startsWith("/") ? String(raw) : `/${raw}`;
  } catch {
    return "/";
  }
};

const aggregateVisitors = (visits, submissions = []) => {
  const leadIps = new Set();
  for (const s of submissions) {
    const ip = s.ip || s.meta?.ip;
    if (ip) leadIps.add(String(ip));
  }

  const byIp = new Map();
  const now = Date.now();

  for (const v of visits) {
    const ip = v.ip || "unknown";
    let row = byIp.get(ip);
    if (!row) {
      row = {
        ip,
        location: v.location || "",
        country: v.country || "",
        city: v.city || "",
        visits: 0,
        lastSeen: v.createdAt,
        firstSeen: v.createdAt,
        path: v.path || "/",
        url: v.url || v.path || "/",
        paths: new Set(),
        signals: new Set(),
        maxScore: 0,
        level: "an toàn",
        recentCount: 0,
      };
      byIp.set(ip, row);
    }
    row.visits += 1;
    row.paths.add(v.path || "/");
    if (v.location) row.location = v.location;
    if (v.country) row.country = v.country;
    if (v.city) row.city = v.city;
    if (new Date(v.createdAt) > new Date(row.lastSeen)) {
      row.lastSeen = v.createdAt;
      row.path = v.path || row.path;
      row.url = v.url || v.path || row.url;
    }
    if (new Date(v.createdAt) < new Date(row.firstSeen)) {
      row.firstSeen = v.createdAt;
    }
    const age = now - new Date(v.createdAt).getTime();
    if (age < 60 * 60 * 1000) row.recentCount += 1;
    const scored = scoreVisit({
      ua: v.ua,
      path: v.path,
      ip,
      recentCount: row.recentCount,
    });
    row.maxScore = Math.max(row.maxScore, scored.score);
    scored.signals.forEach((s) => row.signals.add(s));
    if (scored.level === "nghi ngờ") row.level = "nghi ngờ";
    else if (scored.level === "theo dõi" && row.level === "an toàn") row.level = "theo dõi";
  }

  const visitors = Array.from(byIp.values())
    .map((row) => ({
      ip: row.ip,
      location: row.location || (row.country ? row.country : "—"),
      level: row.level,
      visits: row.visits,
      lead: leadIps.has(row.ip),
      lastSeen: row.lastSeen,
      path: row.path,
      url: row.url,
      paths: Array.from(row.paths).slice(0, 8),
      signals: Array.from(row.signals).slice(0, 4),
    }))
    .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

  const suspicious = visitors.filter((v) => v.level === "nghi ngờ").length;

  return {
    totalVisits: visits.length,
    uniqueIps: visitors.length,
    suspicious,
    visitors,
  };
};

const buildSeries = (visits, buckets = 12) => {
  const series = Array.from({ length: buckets }, () => 0);
  if (!visits.length) return series;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  for (const v of visits) {
    const t = new Date(v.createdAt).getTime();
    if (Number.isNaN(t)) continue;
    const ago = now - t;
    if (ago < 0 || ago >= buckets * windowMs) continue;
    const idx = buckets - 1 - Math.floor(ago / windowMs);
    if (idx >= 0 && idx < buckets) series[idx] += 1;
  }
  return series;
};

module.exports = {
  getClientIp,
  getGeoFromHeaders,
  scoreVisit,
  normalizePath,
  aggregateVisitors,
  buildSeries,
};
