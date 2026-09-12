import type { Metadata } from "next";
import Products from "@/components/Products";
import PageIntro from "@/components/PageIntro";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { products } from "@/data/products";

const packQuantities = Array.from(new Set(products.map((product) => product.quantity))).join(" or ");
export const metadata: Metadata = pageMetadata("Samosa Sheets & Patti: Sizes and Packs", `Compare small 5-inch, medium 7-inch and large 8-inch samosa sheets. Packs contain ${packQuantities}. Enquire for retail or wholesale prices.`, "/products/");
export default function ProductsPage() {
  // This enquiry-only catalogue has no public offers or product reviews.
  // Keep list entries descriptive until genuine Product rich-result data exists.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ready-made samosa sheet range",
    itemListElement: products.map((product, position) => ({
      "@type": "ListItem",
      position: position + 1,
      url: absoluteUrl(`/products/#product-${product.id}`),
      name: product.name,
      description: `${product.description} Size: ${product.size}. Pack: ${product.quantity}.`,
      image: absoluteUrl(product.image),
    })),
  };

  return <><PageIntro path="/products/" eyebrow="Products" title="Ready-made samosa sheets: sizes and packs" copy="Compare samosa patti in three sizes, each packed with 100 sheets. Choose a size for mini snacks, regular service or generous fillings, then enquire for current pricing." /><Products /><JsonLd data={productJsonLd} /></>;
}
