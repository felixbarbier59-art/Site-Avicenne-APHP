const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number.parseInt(process.env.PORT || "4173", 10);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

const server = http.createServer((req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  );

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return send(res, 405, "Method Not Allowed");
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return send(res, 400, "Bad Request");
  }

  if (pathname === "/healthz") {
    return send(res, 200, JSON.stringify({ status: "ok" }), "application/json; charset=utf-8");
  }

  if (pathname === "/") pathname = "/index.html";
  if (pathname.includes("\\") || pathname.split("/").some((part) => part.startsWith("."))) {
    return send(res, 404, "Not Found");
  }

  const isPublicFile = ["/index.html", "/styles.css", "/script.js"].includes(pathname);
  const isPublicAsset = pathname.startsWith("/assets/");
  if (!isPublicFile && !isPublicAsset) return send(res, 404, "Not Found");

  const filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(`${root}${path.sep}`)) return send(res, 404, "Not Found");

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) return send(res, 404, "Not Found");

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()];
    if (!contentType) return send(res, 404, "Not Found");

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": pathname === "/index.html" ? "no-cache" : "public, max-age=3600",
    });
    if (req.method === "HEAD") return res.end();

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!res.headersSent) send(res, 500, "Internal Server Error");
      else res.destroy();
    });
    stream.pipe(res);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Avicenne Orthopédie listening on 0.0.0.0:${port}`);
});
