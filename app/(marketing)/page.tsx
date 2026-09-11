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

export const metadata = pageMetadata(`${site.brand} | Ready-Made Samosa Sheets in South India`, `Buy ready-made samosa sheets and samosa patti from ${site.brand} by ${site.name} in Chennai. Retail and wholesale packs for Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and India.`, "/");

export default function Home() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${site.brand} | Samosa Sheets & Patti Supplier in South India`,
    alternateName: ["Samosa Sheet", "Samosa Patti"],
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
