const { handleApi } = require("../lib/api-handler");

module.exports = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = url.pathname;
  if (!pathname.startsWith("/api")) pathname = `/api${pathname}`;
  return handleApi(req, res, pathname);
};
