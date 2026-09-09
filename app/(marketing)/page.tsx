import Hero from "@/components/Hero";
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
import { absoluteUrl } from "@/lib/seo";

export default function Home() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Ready-Made Samosa Sheets in India | ${site.name}`,
    url: site.domain,
    description: "Ready-made samosa sheets for retail, food-service and wholesale requirements across India.",
    primaryImageOfPage: absoluteUrl("/images/samosa-sheets-hero.png"),
    about: "Ready-made samosa sheets",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };

  return <>
    <Hero /><Products /><Benefits /><HowToUse /><About /><Wholesale /><Testimonials /><FAQ /><Contact />
    <JsonLd data={pageJsonLd} />
  </>;
}
