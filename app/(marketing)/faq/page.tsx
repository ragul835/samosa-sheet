import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageIntro from "@/components/PageIntro";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Samosa Sheet FAQs: Storage, Sizes & Orders", "Find answers about samosa patti sizes, pack quantities, storage, shelf life, Chennai orders, delivery and wholesale samosa sheet supply.", "/faq/");
export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return <><PageIntro path="/faq/" eyebrow="FAQ" title="Samosa sheet frequently asked questions" copy="Find quick answers about using, storing and ordering our ready-made samosa sheets." /><FAQ /><JsonLd data={faqJsonLd} /></>;
}
