const path = require("path");
const store = require("./store");
const auth = require("./auth");
const SEOChecklist = require("./seo-checklist");

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
      if (parts[1] === "settings") return json(res, 200, store.getSettings());
      if (parts[1] === "homepage") return json(res, 200, store.getHomepage());
      if (parts[1] === "gallery") return json(res, 200, store.getGallery());
      if (parts[1] === "news") {
        const posts = store.getNews().filter((p) => p.published !== false);
        return json(res, 200, posts);
      }
      if (parts[1] === "translations") return json(res, 200, store.getTranslations());
      if (parts[1] === "pages") return json(res, 200, store.getPages());
      if (parts[1] === "all") {
        return json(res, 200, {
          settings: store.getSettings(),
          homepage: store.getHomepage(),
          gallery: store.getGallery(),
          pages: store.getPages(),
          news: store.getNews().filter((p) => p.published !== false),
        });
      }
    }

    if (resource === "submissions" && method === "POST") {
      const body = await parseBody(req);
      if (!body?.name || !body?.phone) return json(res, 400, { error: "Thiếu họ tên hoặc SĐT" });
      const entry = store.addSubmission({
        type: body.type || "contact",
        name: body.name,
        phone: body.phone,
        email: body.email || "",
        message: body.message || body.need || "",
        meta: body.meta || {},
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
      const news = store.getNews();
      const subs = store.getSubmissions();
      return json(res, 200, {
        news: news.length,
        published: news.filter((p) => p.published !== false).length,
        submissions: subs.length,
        unread: subs.filter((s) => !s.read).length,
        media: store.getMedia().length,
      });
    }

    if (resource === "settings") {
      if (method === "GET") return json(res, 200, store.getSettings());
      if (method === "PUT") {
        const body = await parseBody(req);
        store.saveSettings(body);
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "homepage") {
      if (method === "GET") return json(res, 200, store.getHomepage());
      if (method === "PUT") {
        const body = await parseBody(req);
        store.saveHomepage(body);
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "gallery") {
      if (method === "GET") return json(res, 200, store.getGallery());
      if (method === "PUT") {
        const body = await parseBody(req);
        store.saveGallery(body);
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "pages") {
      if (method === "GET") return json(res, 200, store.getPages());
      if (method === "PUT") {
        const body = await parseBody(req);
        store.savePages(body);
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "translations") {
      if (method === "GET") return json(res, 200, store.getTranslations());
      if (method === "PUT") {
        const body = await parseBody(req);
        store.saveTranslations(body);
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "submissions") {
      if (method === "GET") return json(res, 200, store.getSubmissions());
      if (method === "PUT" && id) {
        const body = await parseBody(req);
        const list = store.getSubmissions().map((s) =>
          String(s.id) === id ? { ...s, ...body } : s
        );
        store.writeJson("submissions.json", list);
        return json(res, 200, { ok: true });
      }
      if (method === "DELETE" && id) {
        store.deleteSubmission(Number(id));
        return json(res, 200, { ok: true });
      }
    }

    if (resource === "news") {
      let posts = store.getNews();
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
        store.saveNews(posts);
        return json(res, 201, { ...post, seoScore: gate.result.score });
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
        store.saveNews(posts);
        return json(res, 200, { ok: true, seoScore: gate.result.score });
      }
      if (method === "DELETE" && id) {
        posts = posts.filter((p) => String(p.id) !== id && p.slug !== id);
        store.saveNews(posts);
        return json(res, 200, { ok: true });
      }
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
      const fs = require("fs");
      const fp = path.join(store.uploadsDir, name);
      fs.writeFileSync(fp, buf);
      const url = `/uploads/${name}`;
      const item = store.addMedia({
        name,
        url,
        size: buf.length,
        uploadedAt: new Date().toISOString(),
        alt: body.alt || "",
      });
      return json(res, 201, { ok: true, url, item });
    }

    if (resource === "media") {
      if (method === "GET") return json(res, 200, store.getMedia());
      if (method === "DELETE" && id) {
        const result = store.deleteMedia(id);
        if (!result.ok) return json(res, 404, { error: "Không tìm thấy ảnh" });
        return json(res, 200, { ok: true });
      }
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    return json(res, 500, { error: err.message || "Server error" });
  }
};

module.exports = { handleApi, parseBody, json };
