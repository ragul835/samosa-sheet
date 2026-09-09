import type { Metadata } from "next";
import Products from "@/components/Products";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "Ready-Made Samosa Sheet Products", description: "Explore small, medium and large ready-made samosa sheets for homes, restaurants, caterers and commercial kitchens across India.", alternates: { canonical: "/products/" } };
export default function ProductsPage() {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ready-made samosa sheet range",
    itemListElement: products.map((product, position) => ({
      "@type": "ListItem",
      position: position + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: absoluteUrl(product.image),
        additionalProperty: [
          { "@type": "PropertyValue", name: "Sheet size", value: product.size },
          { "@type": "PropertyValue", name: "Pack quantity", value: product.quantity },
        ],
      },
    })),
  };

  return <><PageIntro eyebrow="Products" title="Samosa sheets for every kitchen" copy="Choose the right ready-made sheet size for snacks, regular service or high-volume preparation." /><Products /><JsonLd data={[productJsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }])]} /></>;
}
