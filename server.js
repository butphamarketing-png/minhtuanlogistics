const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleApi } = require("./lib/api-handler");

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 5500;
const externalLogoPath =
  "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-Downloads-logistics-080726\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_36f92907f6661f3b83c6c799f6f41f2d_images_image-ee2ac993-805d-4026-b978-fc806db730f6.png";
const externalHeroSlidePath =
  "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-Downloads-logistics-080726\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_36f92907f6661f3b83c6c799f6f41f2d_images_image-a55b2b2a-fa92-433a-9893-c56ac24d28da.png";
const externalLoaderBgPath =
  "C:\\Users\\Admin\\.cursor\\projects\\c-Users-Admin-Downloads-logistics-080726\\assets\\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_36f92907f6661f3b83c6c799f6f41f2d_images_image-d0be6bda-e332-42cc-9a52-1945e6488375.png";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const serveFile = (res, filePath, cache = true) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      ...(cache ? {} : { "Cache-Control": "no-store" }),
    });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  try {
    const rawUrl = req.url || "/";
    const qs = rawUrl.includes("?") ? rawUrl.slice(rawUrl.indexOf("?") + 1) : "";
    let urlPath = decodeURIComponent(rawUrl.split("?")[0]);

    // Legacy ?slug= → /bai-viet/{slug}
    if (urlPath === "/bai-viet" || urlPath === "/bai-viet.html") {
      const slug = new URLSearchParams(qs).get("slug");
      if (slug) {
        res.writeHead(301, { Location: `/bai-viet/${encodeURIComponent(slug)}` });
        return res.end();
      }
    }

    if (urlPath === "/") urlPath = "/index.html";
    if (urlPath === "/adminbp") urlPath = "/adminbp/index.html";

    // Clean URLs: /gioi-thieu → gioi-thieu.html, /bai-viet/slug → bai-viet/slug.html
    if (!path.extname(urlPath) && urlPath !== "/") {
      const asHtml = path.resolve(root, "." + urlPath + ".html");
      if (asHtml.startsWith(root) && fs.existsSync(asHtml)) {
        urlPath = urlPath + ".html";
      }
    }

    if (urlPath.startsWith("/api/")) {
      return handleApi(req, res, urlPath);
    }

    if (urlPath === "/logo.png") {
      const localLogo = path.join(root, "logo.png");
      const logoPath = fs.existsSync(localLogo) ? localLogo : externalLogoPath;
      return fs.readFile(logoPath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("Not found: logo.png");
        }
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    }

    if (urlPath === "/hero-slide-1.png") {
      const localHero = path.join(root, "hero-slide-1.png");
      const heroPath = fs.existsSync(localHero) ? localHero : externalHeroSlidePath;
      return fs.readFile(heroPath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("Not found: hero-slide-1.png");
        }
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    }

    if (urlPath === "/loader-bg.png") {
      const localLoaderBg = path.join(root, "loader-bg.png");
      const loaderPath = fs.existsSync(localLoaderBg) ? localLoaderBg : externalLoaderBgPath;
      return fs.readFile(loaderPath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("Not found: loader-bg.png");
        }
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      });
    }

    if (urlPath.startsWith("/uploads/")) {
      const filePath = path.resolve(root, "." + urlPath);
      if (!filePath.startsWith(path.join(root, "uploads"))) {
        res.writeHead(403);
        return res.end("Forbidden");
      }
      return serveFile(res, filePath);
    }

    const filePath = path.resolve(root, "." + urlPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Forbidden");
    }

    serveFile(res, filePath, !urlPath.startsWith("/adminbp/"));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  console.log(`Admin panel: http://127.0.0.1:${port}/adminbp`);
});
