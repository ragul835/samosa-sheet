import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/data/products";

export const dynamic = "force-static";

const homeImages = [
  "/images/samosa-sheets-natural-premium-hero-v2.webp",
  ...products.map((product) => product.image),
  "/images/samosa-sheets-rectangle-separation-v2.webp",
  "/images/samosa-sheet-rectangle-folding-v2.webp",
  "/images/samosas-premium-serving.webp",
  "/images/golden-samosas-premium-background-v3.webp",
  "/images/samosa-sheets-promotional-poster.webp",
  "/images/banana-leaf-samosas-gallery.webp",
];

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
    changeFrequency,
    priority,
    ...(path === "/"
      ? { images: homeImages.map((image) => `${site.domain}${image}`) }
      : path === "/products/"
        ? { images: products.map((product) => `${site.domain}${product.image}`) }
        : path === "/about/"
          ? { images: [`${site.domain}/images/banana-leaf-samosas-gallery.webp`] }
          : {}),
  }));
}
