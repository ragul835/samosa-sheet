import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const routes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/wholesale/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/how-to-use/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact/", changeFrequency: "monthly", priority: 0.8 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, `${site.domain}/`).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
    ...(path === "/"
      ? { images: [`${site.domain}/images/samosa-sheets-hero.png`] }
      : {}),
  }));
}
