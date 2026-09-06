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

export default function Home() {
  return <>
    <Hero /><Products /><Benefits /><HowToUse /><About /><Wholesale /><Testimonials /><FAQ /><Contact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "FoodEstablishment", name: site.name,
      url: site.domain, telephone: site.phone, email: site.email, address: site.address,
      image: `${site.domain}/images/samosa-sheets-hero.png`,
      description: "Manufacturer and supplier of ready-made samosa sheets for homes, restaurants, catering and wholesale buyers."
    }).replace(/</g, "\\u003c") }} />
  </>;
}
