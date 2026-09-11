import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.env.STATIC_ROOT || "out");
const host = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function securityHeaders(response) {
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "SAMEORIGIN");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function resolveRequestPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relative = decoded.replace(/^\/+/, "");
  let candidate = resolve(root, relative || "index.html");
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return null;

  try {
    if (statSync(candidate).isDirectory()) candidate = resolve(candidate, "index.html");
  } catch {
    if (!extname(candidate)) candidate = resolve(candidate, "index.html");
  }

  return candidate;
}

const server = createServer((request, response) => {
  securityHeaders(response);

  if (request.url === "/healthz") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    response.end('{"status":"ok"}\n');
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const requestUrl = new URL(request.url || "/", "http://localhost");
  const pathname = requestUrl.pathname;
  let filePath = resolveRequestPath(pathname);
  let fileStat;
  try {
    fileStat = filePath ? statSync(filePath) : null;
    if (!fileStat?.isFile()) throw new Error("not found");
  } catch {
    filePath = resolve(root, "404.html");
    try {
      fileStat = statSync(filePath);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }
    response.statusCode = 404;
  }

  // Redirect only existing pages, preserving queries and real 404 responses.
  // A fixed-origin URL prevents a double-slash path becoming an open redirect.
  if (response.statusCode === 200 && filePath.endsWith(`${sep}index.html`)) {
    const canonicalPath = pathname.endsWith("/index.html")
      ? pathname.slice(0, -10)
      : pathname.endsWith("/") ? pathname : `${pathname}/`;
    const safePath = canonicalPath.replace(/^\/+/, "/");
    if (safePath !== pathname) {
      response.writeHead(308, { Location: `${safePath}${requestUrl.search}` });
      response.end();
      return;
    }
  }

  const extension = extname(filePath).toLowerCase();
  response.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
  response.setHeader(
    "Cache-Control",
    pathname.startsWith("/_next/static/")
      ? "public, max-age=31536000, immutable"
      : "public, max-age=0, must-revalidate",
  );
  response.setHeader("Content-Length", fileStat.size);
  if (!response.statusCode || response.statusCode === 200) response.statusCode = 200;

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on("error", () => response.destroy());
  stream.pipe(response);
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 30_000;

server.listen(port, host, () => {
  console.log(`Production site listening on http://${host}:${server.address().port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  server.close((error) => process.exit(error ? 1 : 0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
