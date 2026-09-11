import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve("out");
const indexable = ["/", "/products/", "/wholesale/", "/how-to-use/", "/about/", "/faq/", "/contact/"];
const excluded = ["/privacy-policy/", "/terms/"];
const titles = new Set();
const descriptions = new Set();
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]));
const meta = (html, name) => [...html.matchAll(/<meta\s[^>]*>/g)].map(([tag]) => attrs(tag)).filter((tag) => tag.name === name || tag.property === name).map((tag) => tag.content);
const links = (html, rel) => [...html.matchAll(/<link\s[^>]*>/g)].map(([tag]) => attrs(tag)).filter((tag) => tag.rel === rel);
const flatten = (value) => Array.isArray(value) ? value.flatMap(flatten) : value["@graph"] ? flatten(value["@graph"]) : [value];
const home = await readFile(resolve(root, "index.html"), "utf8");
const origin = new URL(links(home, "canonical")[0].href).origin;
assert.match(origin, /^https:\/\//, "Production canonicals must use HTTPS");

for (const path of [...indexable, ...excluded]) {
  const html = await readFile(resolve(root, `.${path}`, "index.html"), "utf8");
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || "");
  const description = meta(html, "description");
  assert.ok(title && !titles.has(title), `${path}: missing or duplicate title`);
  assert.equal(description.length, 1, `${path}: exactly one description`);
  assert.ok(description[0] && !descriptions.has(description[0]), `${path}: missing or duplicate description`);
  titles.add(title);
  descriptions.add(description[0]);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one H1`);
  assert.deepEqual(links(html, "canonical").map((tag) => tag.href), [origin + path], `${path}: self canonical`);
  assert.deepEqual(meta(html, "og:url"), [origin + path], `${path}: social URL`);
  for (const field of ["og:title", "twitter:title"]) assert.deepEqual(meta(html, field), [title], `${path}: ${field}`);
  for (const field of ["og:description", "twitter:description"]) assert.deepEqual(meta(html, field), description, `${path}: ${field}`);
  const robots = meta(html, "robots").join(",");
  assert.match(robots, excluded.includes(path) ? /noindex/ : /(?:^|,)\s*index(?:,|$)/, `${path}: indexing directive`);
  if (indexable.includes(path)) assert.ok(!robots.includes("noindex"));
  assert.ok(links(html, "icon").length, `${path}: favicon`);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, json]) => flatten(JSON.parse(json)));
  const business = schemas.find((schema) => schema["@type"] === "LocalBusiness");
  assert.ok(business?.name && business?.telephone && business?.address?.postalCode, `${path}: local business details`);
  assert.ok(business.logo?.endsWith("/images/samosa-sheet-logo.png"), `${path}: organization logo`);
  assert.ok(!business.sameAs.some((url) => /yourbusiness/.test(url)), `${path}: placeholder social profile`);
  if (indexable.includes(path) && path !== "/") {
    const breadcrumbs = schemas.filter((schema) => schema["@type"] === "BreadcrumbList");
    assert.equal(breadcrumbs.length, 1, `${path}: one breadcrumb schema`);
    assert.equal(breadcrumbs[0].itemListElement.at(-1).item, origin + path);
  }
  const visibleText = decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " "));
  assert.doesNotMatch(visibleText, /Update them based|should be updated|yourbusiness/i, `${path}: unfinished copy`);
  for (const schema of schemas.filter((schema) => schema["@type"] === "FAQPage")) {
    for (const question of schema.mainEntity) {
      assert.ok(visibleText.includes(question.name) && visibleText.includes(question.acceptedAnswer.text), `${path}: FAQ matches visible content`);
    }
  }
  for (const [tag] of html.matchAll(/<(?:a|img)\s[^>]*>/g)) {
    const attributes = attrs(tag);
    const target = attributes.href || attributes.src;
    if (!target || !target.startsWith("/") || target.startsWith("//")) continue;
    const url = new URL(target, origin);
    const file = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
    await access(resolve(root, `.${file}`));
    if (url.hash && !attributes.src) {
      const targetHtml = await readFile(resolve(root, `.${file}`), "utf8");
      assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: broken fragment ${target}`);
    }
  }
  for (const image of meta(html, "og:image")) await access(resolve(root, `.${new URL(image).pathname}`));
  console.log(`SEO passed: ${path}`);
}

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => decode(url));
assert.deepEqual(sitemapUrls.sort(), indexable.map((path) => origin + path).sort(), "Sitemap includes exactly the indexable canonical pages");
assert.ok(!sitemap.includes("<lastmod>"), "Do not manufacture modification dates at build time");
const robots = await readFile(resolve(root, "robots.txt"), "utf8");
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`) && robots.includes("Allow: /"));
const notFound = await readFile(resolve(root, "404.html"), "utf8");
assert.match(meta(notFound, "robots").join(","), /noindex/, "404 must be noindex");

// Use a dedicated ephemeral port; leave any running user servers untouched.
const server = spawn(process.execPath, ["scripts/static-server.mjs"], {
  env: { ...process.env, PORT: "0", HOST: "127.0.0.1", STATIC_ROOT: root },
  stdio: ["ignore", "pipe", "pipe"],
});
try {
  const base = await new Promise((resolveBase, reject) => {
    const timer = setTimeout(() => reject(new Error("Static server startup timed out")), 10000);
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timer); resolveBase(match[0]); }
    });
    server.once("error", (error) => { clearTimeout(timer); reject(error); });
    server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Static server exited: ${code}`)); });
    server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  });
  for (const path of [...indexable, ...excluded, "/robots.txt", "/sitemap.xml", "/icon.svg"]) {
    const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200, `${path}: HTTP status`);
    await response.arrayBuffer();
  }
  for (const [path, expected] of [["/products?source=test", "/products/?source=test"], ["/products/index.html", "/products/"], ["/index.html", "/"]]) {
    const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 308, `${path}: permanent redirect`);
    assert.equal(response.headers.get("location"), expected);
  }
  for (const path of ["/missing-seo-test/", "/missing-seo-test", "/missing-seo-test.png"]) {
    const response = await fetch(base + path, { redirect: "manual", signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 404, `${path}: real 404, not homepage fallback`);
    await response.arrayBuffer();
  }
  const head = await fetch(base + "/products/", { method: "HEAD", signal: AbortSignal.timeout(5000) });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  console.log("SEO passed: sitemap, robots, assets, internal links, HTTP redirects and 404s");
} finally {
  server.kill("SIGTERM");
}
