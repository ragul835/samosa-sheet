import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import HowToUse from "@/components/HowToUse";
import About from "@/components/About";
import Wholesale from "@/components/Wholesale";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Samosa Sheet & Patti Supplier", `Order ready-made samosa sheets from ${site.brand} by ${site.name}, Chennai. Compare sizes and 100-sheet packs. Contact us for retail and wholesale prices.`, "/");

export default function Home() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl("/#webpage"),
    name: `Samosa Sheet & Patti Supplier | ${site.brand}`,
    url: absoluteUrl("/"),
    description: metadata.description,
    primaryImageOfPage: absoluteUrl("/images/samosa-sheets-rectangular-premium-hero-v3.webp"),
    about: "Ready-made samosa sheets",
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };

  return <>
    <Hero /><Products /><Benefits /><Gallery /><HowToUse /><About /><Wholesale /><Testimonials /><FAQ /><Contact />
    <JsonLd data={pageJsonLd} />
  </>;
}
