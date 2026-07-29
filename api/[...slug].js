module.exports = async (req, res) => {
  try {
    const { handleApi } = require("../lib/api-handler");
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    let pathname = url.pathname;
    if (!pathname.startsWith("/api")) pathname = `/api${pathname}`;
    return await handleApi(req, res, pathname);
  } catch (err) {
    console.error("[api]", err);
    const body = JSON.stringify({ error: err.message || "Server error" });
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(body);
  }
};
