const path = require("path");
require("./env").loadEnv();
const store = require("./store");
const auth = require("./auth");
const SEOChecklist = require("./seo-checklist");
const r2 = require("./r2");
const supabase = require("./supabase");
const cmsDb = require("./cms-db");
const visitsLib = require("./visits");

const json = (res, status, data, extraHeaders = {}) => {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(body);
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") return resolve(null);
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });

const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const handleApi = async (req, res, urlPath) => {
  const method = req.method || "GET";
  const parts = urlPath.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const resource = parts[0] || "";
  const id = parts[1] || "";

  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  try {
    /* ---- Public endpoints ---- */
    if (resource === "public") {
      if (parts[1] === "settings") return json(res, 200, await store.getSettings());
      if (parts[1] === "homepage") return json(res, 200, await store.getHomepage());
      if (parts[1] === "gallery") return json(res, 200, await store.getGallery());
      if (parts[1] === "news") {
        // Listing uses static news-index via news-data.js — avoid shipping 1000 posts on every page.
        return json(res, 200, []);
      }
      if (parts[1] === "translations") return json(res, 200, await store.getTranslations());
      if (parts[1] === "pages") return json(res, 200, await store.getPages());
      if (parts[1] === "subpages") return json(res, 200, await store.getSubpages());
      if (parts[1] === "seo-pages") return json(res, 200, await store.getSeoPages());
      if (parts[1] === "all") {
        const [settings, homepage, gallery, pages, subpages, seoPages] = await Promise.all([
          store.getSettings(),
          store.getHomepage(),
          store.getGallery(),
          store.getPages(),
          store.getSubpages(),
          store.getSeoPages(),
        ]);
        return json(res, 200, {
          settings,
          homepage,
          gallery,
          pages,
          news: [],
          subpages,
          seoPages,
        });
      }
    }

    if (resource === "submissions" && method === "POST") {
      const body = await parseBody(req);
      if (!body?.name || !body?.phone) return json(res, 400, { error: "Thiếu họ tên hoặc SĐT" });
      const ip = visitsLib.getClientIp(req);
      const entry = await store.addSubmission({
        type: body.type || "contact",
        name: body.name,
        phone: body.phone,
        email: body.email || "",
        message: body.message || body.need || "",
        meta: { ...(body.meta || {}), ip, path: body.meta?.path || body.path || "" },
        ip,
      });
      return json(res, 201, { ok: true, id: entry.id });
    }

    if (resource === "track" && method === "POST") {
      const body = (await parseBody(req)) || {};
      const ip = visitsLib.getClientIp(req);
      const geo = visitsLib.getGeoFromHeaders(req);
      const pagePath = visitsLib.normalizePath(body.path || body.url || "/");
      const ua = String(req.headers["user-agent"] || body.ua || "").slice(0, 300);
      const referrer = String(body.referrer || req.headers.referer || "").slice(0, 500);
      const url = String(body.url || pagePath).slice(0, 500);
      const location = body.location || geo.location || "";

      const entry = await store.addVisit({
        ip,
        path: pagePath,
        url,
        referrer,
        ua,
        country: geo.country || body.country || "",
        city: geo.city || body.city || "",
        location,
      });
      return json(res, 201, { ok: true, id: entry.id });
    }

    /* ---- Auth ---- */
    if (resource === "auth") {
      if (parts[1] === "login" && method === "POST") {
        const body = await parseBody(req);
        const token = auth.authenticate(body?.username, body?.password);
        if (!token) return json(res, 401, { error: "Sai tên đăng nhập hoặc mật khẩu" });
        return json(res, 200, { ok: true, token, user: body.username }, {
          "Set-Cookie": `admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200`,
        });
      }
      if (parts[1] === "logout" && method === "POST") {
        return json(res, 200, { ok: true }, {
          "Set-Cookie": "admin_token=; Path=/; HttpOnly; Max-Age=0",
        });
      }
      if (parts[1] === "me" && method === "GET") {
        const session = auth.requireAuth(req);
        if (!session) return json(res, 401, { error: "Unauthorized" });
        return json(res, 200, { user: session.user });
      }
    }

    /* ---- Protected routes ---- */
    const session = auth.requireAuth(req);
    if (!session) return json(res, 401, { error: "Unauthorized" });

    if (resource === "dashboard") {
      const [news, subs, subpages, media, visitRows] = await Promise.all([
        store.getNews(),
        store.getSubmissions(),
        store.getSubpages(),
        store.getMedia(),
        store.getVisits(),
      ]);
      const traffic = visitsLib.aggregateVisitors(visitRows, subs);
      return json(res, 200, {
        news: news.length,
        published: news.filter((p) => p.published !== false).length,
        submissions: subs.length,
        unread: subs.filter((s) => !s.read).length,
        media: media.length,
        about: (subpages.about || []).length,
        services: (subpages.services || []).length,
        cms: store.cmsEnabled(),
        visitsTotal: traffic.totalVisits,
        uniqueIps: traffic.uniqueIps,
        suspiciousIps: traffic.suspicious,
        visitSeries: visitsLib.buildSeries(visitRows, 12),
        visitors: traffic.visitors.slice(0, 100),
      });
    }

    if (resource === "visits") {
      const [visitRows, subs] = await Promise.all([store.getVisits(), store.getSubmissions()]);
      const traffic = visitsLib.aggregateVisitors(visitRows, subs);
      return json(res, 200, {
        visitsTotal: traffic.totalVisits,
        uniqueIps: traffic.uniqueIps,
        suspiciousIps: traffic.suspicious,
        visitSeries: visitsLib.buildSeries(visitRows, 12),
        visitors: traffic.visitors.slice(0, 200),
      });
    }

    if (resource === "settings") {
      if (method === "GET") return json(res, 200, await store.getSettings());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.saveSettings(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "homepage") {
      if (method === "GET") return json(res, 200, await store.getHomepage());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.saveHomepage(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "gallery") {
      if (method === "GET") return json(res, 200, await store.getGallery());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.saveGallery(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "pages") {
      if (method === "GET") return json(res, 200, await store.getPages());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.savePages(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "translations") {
      if (method === "GET") return json(res, 200, await store.getTranslations());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.saveTranslations(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "submissions") {
      if (method === "GET") return json(res, 200, await store.getSubmissions());
      if (method === "PUT" && id) {
        const body = await parseBody(req);
        const list = (await store.getSubmissions()).map((s) =>
          String(s.id) === id ? { ...s, ...body } : s
        );
        // Replace all via clear+insert is heavy; write local + upsert changed row
        try {
          store.writeJson("submissions.json", list);
        } catch (_) {}
        const updated = list.find((s) => String(s.id) === id);
        if (updated && cmsDb.isConfigured()) await cmsDb.addSubmissionRow(updated);
        return json(res, 200, { ok: true });
      }
      if (method === "DELETE" && id) {
        await store.deleteSubmission(Number(id));
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "news") {
      let posts = await store.getNews();
      if (method === "GET" && !id) return json(res, 200, posts);
      if (method === "GET" && id) {
        const post = posts.find((p) => String(p.id) === id || p.slug === id);
        if (!post) return json(res, 404, { error: "Not found" });
        return json(res, 200, post);
      }
      if (method === "POST") {
        const body = await parseBody(req);
        const nextId = posts.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
        const slug = body.slug || slugify(body.title || body.keyword);
        const post = {
          id: nextId,
          slug,
          published: body.published !== false,
          date: body.date || new Date().toISOString().slice(0, 10),
          dateLabel: body.dateLabel || new Date().toLocaleDateString("vi-VN"),
          ...body,
        };
        const gate = SEOChecklist.assertPublishable(post, {
          existingPosts: posts,
          currentId: post.id,
        });
        if (!gate.ok) {
          return json(res, 400, {
            error: gate.error,
            fails: gate.fails,
            seo: { score: gate.result.score, canPublish: false },
          });
        }
        posts.unshift(post);
        await store.upsertNewsPost(post);
        let rebuild = null;
        try {
          const gen = require("../scripts/generate-article-pages");
          gen.writeArticle(post, posts);
          rebuild = { ok: true, targets: ["article:" + post.slug] };
        } catch (e) {
          rebuild = { ok: false, error: e.message };
        }
        return json(res, 201, { ...post, seoScore: gate.result.score, rebuild });
      }
      if (method === "PUT" && id) {
        const body = await parseBody(req);
        const current = posts.find((p) => String(p.id) === id || p.slug === id);
        if (!current) return json(res, 404, { error: "Not found" });
        const merged = { ...current, ...body, id: current.id };
        const gate = SEOChecklist.assertPublishable(merged, {
          existingPosts: posts,
          currentId: current.id,
        });
        if (!gate.ok) {
          return json(res, 400, {
            error: gate.error,
            fails: gate.fails,
            seo: { score: gate.result.score, canPublish: false },
          });
        }
        posts = posts.map((p) => (String(p.id) === String(current.id) ? merged : p));
        await store.upsertNewsPost(merged);
        let rebuild = null;
        try {
          const gen = require("../scripts/generate-article-pages");
          gen.writeArticle(merged, posts);
          rebuild = { ok: true, targets: ["article:" + merged.slug] };
        } catch (e) {
          rebuild = { ok: false, error: e.message };
        }
        return json(res, 200, { ok: true, seoScore: gate.result.score, rebuild });
      }
      if (method === "DELETE" && id) {
        const current = posts.find((p) => String(p.id) === id || p.slug === id);
        await store.deleteNewsPost(current?.id || id);
        try {
          if (current?.slug) {
            const fs = require("fs");
            const fp = path.join(store.root, "bai-viet", `${current.slug}.html`);
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
          }
        } catch (_) {}
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "subpages") {
      const kind = id; // about | services
      const slug = parts[2] || "";
      let data = await store.getSubpages();
      if (method === "GET" && !kind) return json(res, 200, data);
      if (method === "GET" && kind && !slug) {
        if (!["about", "services"].includes(kind)) return json(res, 404, { error: "Not found" });
        return json(res, 200, data[kind] || []);
      }
      if (method === "GET" && kind && slug) {
        const page = (data[kind] || []).find((p) => p.slug === slug);
        if (!page) return json(res, 404, { error: "Not found" });
        return json(res, 200, page);
      }
      if (method === "PUT" && !kind) {
        const body = await parseBody(req);
        await store.saveSubpages(body);
        let rebuild = null;
        try {
          rebuild = require("./rebuild").rebuildSite(["subpages", "sitemap"]);
        } catch (e) {
          rebuild = { ok: false, error: e.message };
        }
        return json(res, 200, { ok: true, rebuild });
      }
      if (method === "PUT" && kind && slug) {
        if (!["about", "services"].includes(kind)) return json(res, 404, { error: "Not found" });
        const body = await parseBody(req);
        const list = data[kind] || [];
        const idx = list.findIndex((p) => p.slug === slug);
        if (idx < 0) return json(res, 404, { error: "Not found" });
        list[idx] = { ...list[idx], ...body, slug: list[idx].slug, parent: list[idx].parent };
        data = { ...data, [kind]: list };
        await store.saveSubpages(data);
        let rebuild = null;
        try {
          rebuild = require("./rebuild").rebuildSite(["subpages", "sitemap"]);
        } catch (e) {
          rebuild = { ok: false, error: e.message };
        }
        return json(res, 200, { ok: true, page: list[idx], rebuild });
      }
      if (method === "POST" && kind) {
        if (!["about", "services"].includes(kind)) return json(res, 404, { error: "Not found" });
        const body = await parseBody(req);
        const list = data[kind] || [];
        const newSlug = body.slug || slugify(body.title || body.primaryKeyword);
        if (list.some((p) => p.slug === newSlug)) return json(res, 400, { error: "Slug đã tồn tại" });
        const page = {
          slug: newSlug,
          parent: kind === "about" ? "gioi-thieu" : "dich-vu",
          parentLabel: kind === "about" ? "Giới thiệu" : "Dịch vụ",
          primaryKeyword: body.primaryKeyword || "",
          secondaryKeywords: body.secondaryKeywords || [],
          title: body.title || "",
          metaTitle: body.metaTitle || body.title || "",
          metaDescription: body.metaDescription || "",
          lead: body.lead || "",
          images: body.images || [],
          sections: body.sections || [],
          highlights: body.highlights || [],
          faqs: body.faqs || [],
          internalLinks: body.internalLinks || [],
          externalLinks: body.externalLinks || [],
          ...body,
          slug: newSlug,
        };
        list.push(page);
        data = { ...data, [kind]: list };
        await store.saveSubpages(data);
        let rebuild = null;
        try {
          rebuild = require("./rebuild").rebuildSite(["subpages", "sitemap"]);
        } catch (e) {
          rebuild = { ok: false, error: e.message };
        }
        return json(res, 201, { ok: true, page, rebuild });
      }
      if (method === "DELETE" && kind && slug) {
        if (!["about", "services"].includes(kind)) return json(res, 404, { error: "Not found" });
        const list = (data[kind] || []).filter((p) => p.slug !== slug);
        data = { ...data, [kind]: list };
        await store.saveSubpages(data);
        try {
          require("./rebuild").rebuildSite(["subpages", "sitemap"]);
        } catch (_) {}
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "seo-pages") {
      if (method === "GET") return json(res, 200, await store.getSeoPages());
      if (method === "PUT") {
        const body = await parseBody(req);
        await store.saveSeoPages(body);
        return json(res, 200, { ok: true, storage: store.cmsEnabled() ? "supabase" : "local" });
      }
    }

    if (resource === "rebuild" && method === "POST") {
      const body = await parseBody(req);
      const targets = body?.targets || ["subpages", "articles", "sitemap"];
      try {
        const result = require("./rebuild").rebuildSite(targets);
        return json(res, result.ok ? 200 : 500, result);
      } catch (e) {
        return json(res, 500, { ok: false, error: e.message });
      }
    }

    if (resource === "storage-status" && method === "GET") {
      const [sb, cms] = await Promise.all([supabase.health(), cmsDb.healthCms()]);
      return json(res, 200, {
        r2: { configured: r2.isConfigured(), publicUrl: process.env.R2_PUBLIC_URL || null },
        supabase: sb,
        cms,
      });
    }

    if (resource === "upload" && method === "POST") {
      const body = await parseBody(req);
      if (!body?.data || !body?.filename) return json(res, 400, { error: "Thiếu file" });
      const ext = path.extname(body.filename).toLowerCase() || ".png";
      const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
      if (!allowed.includes(ext)) return json(res, 400, { error: "Định dạng không hỗ trợ" });
      const buf = Buffer.from(body.data.replace(/^data:[^;]+;base64,/, ""), "base64");
      if (buf.length > 5 * 1024 * 1024) return json(res, 400, { error: "File quá lớn (max 5MB)" });
      store.ensureDirs();
      const name = `${Date.now()}-${slugify(path.basename(body.filename, ext))}${ext}`;
      const key = `uploads/${name}`;
      let url;
      let storage = "local";
      let objectKey = null;

      if (r2.isConfigured()) {
        const uploaded = await r2.uploadObject({
          key,
          body: buf,
          contentType: r2.contentTypeFor(ext),
        });
        url = uploaded.url;
        storage = "r2";
        objectKey = uploaded.key;
      } else {
        const fs = require("fs");
        const fp = path.join(store.uploadsDir, name);
        fs.writeFileSync(fp, buf);
        url = `/uploads/${name}`;
      }

      const item = await store.addMedia({
        name,
        url,
        key: objectKey,
        storage,
        size: buf.length,
        uploadedAt: new Date().toISOString(),
        alt: body.alt || "",
      });

      const sync = await supabase.upsertMedia(item);
      return json(res, 201, {
        ok: true,
        url,
        item,
        storage,
        supabase: sync.ok ? "synced" : sync.skipped ? "skipped" : `error:${sync.error}`,
      });
    }

    if (resource === "media") {
      if (method === "GET") return json(res, 200, await store.getMedia());
      if (method === "DELETE" && id) {
        const result = await store.deleteMedia(id);
        if (!result.ok) return json(res, 404, { error: "Không tìm thấy ảnh" });
        if (result.deleted?.key) {
          try {
            await r2.deleteObject(result.deleted.key);
          } catch {
            /* ignore remote delete errors */
          }
        }
        await supabase.deleteMedia(result.deleted?.id || id);
        return json(res, 200, { ok: true });
      }
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    return json(res, 500, { error: err.message || "Server error" });
  }
};

module.exports = { handleApi, parseBody, json };
