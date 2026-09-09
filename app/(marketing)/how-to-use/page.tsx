import type { Metadata } from "next";
import HowToUse from "@/components/HowToUse";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = { title: "How to Use Samosa Sheets", description: "Learn how to thaw, fill, fold, seal and cook ready-made samosa sheets with a clear step-by-step guide and video.", alternates: { canonical: "/how-to-use/" } };
export default function HowToUsePage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to make samosas with ready-made samosa sheets",
    description: "A step-by-step guide for thawing, filling, folding, sealing and cooking samosas.",
    image: absoluteUrl("/images/samosa-sheets-hero.png"),
    step: [
      "Thaw the sheets.",
      "Prepare and cool the filling.",
      "Fold one sheet into a cone.",
      "Fill the samosa without overfilling.",
      "Fold and seal with flour-and-water paste.",
      "Cook until crisp and golden.",
    ].map((text, position) => ({ "@type": "HowToStep", position: position + 1, text })),
  };

  return <><PageIntro eyebrow="How to Use" title="Make crisp samosas with confidence" copy="Follow the complete preparation method from thawing the sheets through folding, sealing and cooking." /><HowToUse /><JsonLd data={[howToJsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "How to Use", path: "/how-to-use/" }])]} /></>;
}
