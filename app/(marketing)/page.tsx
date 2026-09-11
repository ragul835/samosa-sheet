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

export const metadata = pageMetadata("Ready-Made Samosa Sheets & Patti in Chennai", `Buy ready-made samosa sheets from ${site.name} in Chennai. Compare three sizes for home and wholesale orders. Contact us for prices and delivery availability.`, "/");

export default function Home() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Ready-Made Samosa Sheets & Patti in Chennai | ${site.name}`,
    url: site.domain,
    description: "Ready-made samosa sheets for retail, food-service and wholesale requirements across India.",
    primaryImageOfPage: absoluteUrl("/images/banana-leaf-samosas-hero.webp"),
    about: "Ready-made samosa sheets",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };

  return <>
    <Hero /><Products /><Benefits /><Gallery /><HowToUse /><About /><Wholesale /><Testimonials /><FAQ /><Contact />
    <JsonLd data={pageJsonLd} />
  </>;
}
