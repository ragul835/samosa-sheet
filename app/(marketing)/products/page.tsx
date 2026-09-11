import type { Metadata } from "next";
import Products from "@/components/Products";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { products } from "@/data/products";

export const metadata: Metadata = pageMetadata("Samosa Sheets & Patti: Sizes and Packs", "Compare small 5-inch, medium 7-inch and large 8-inch samosa sheets in packs of 50. Enquire about prices and availability for home or bulk orders.", "/products/");
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
        "@id": absoluteUrl(`/products/#product-${product.id}`),
        url: absoluteUrl(`/products/#product-${product.id}`),
        brand: { "@type": "Brand", name: site.name },
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

  return <><PageIntro path="/products/" eyebrow="Products" title="Ready-made samosa sheets: sizes and packs" copy="Compare samosa patti in three sizes, each packed with 100 sheets. Choose a size for mini snacks, regular service or generous fillings, then enquire for current pricing." /><Products /><JsonLd data={productJsonLd} /></>;
}
