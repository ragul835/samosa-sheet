import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/data/faqs";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = { title: "Samosa Sheet FAQs", description: "Answers to common questions about samosa sheet storage, preparation, ordering, delivery and wholesale supply.", alternates: { canonical: "/faq/" } };
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

  return <><PageIntro eyebrow="FAQ" title="Frequently asked questions" copy="Find quick answers about using, storing and ordering our ready-made samosa sheets." /><FAQ /><JsonLd data={[faqJsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq/" }])]} /></>;
}
