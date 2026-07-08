const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = 5500;
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
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

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

    const filePath = path.resolve(root, "." + urlPath);
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Forbidden");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Not found: " + urlPath);
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
      });
      res.end(data);
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
