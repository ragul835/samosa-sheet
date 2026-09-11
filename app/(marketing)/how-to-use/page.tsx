import type { Metadata } from "next";
import HowToUse from "@/components/HowToUse";
import PageIntro from "@/components/PageIntro";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("How to Fold & Use Ready-Made Samosa Sheets", "Learn how to thaw, fill, fold and seal samosa patti with our step-by-step guide, folding video and tips for preparing crisp samosas.", "/how-to-use/");
export default function HowToUsePage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to make samosas with ready-made samosa sheets",
    description: "A step-by-step guide for thawing, filling, folding, sealing and cooking samosas.",
    image: absoluteUrl("/images/banana-leaf-samosas-hero.webp"),
    step: [
      "Thaw the sheets.",
      "Prepare and cool the filling.",
      "Fold one sheet into a cone.",
      "Fill the samosa without overfilling.",
      "Fold and seal with flour-and-water paste.",
      "Cook until crisp and golden.",
    ].map((text, position) => ({ "@type": "HowToStep", position: position + 1, text })),
  };

  return <><PageIntro path="/how-to-use/" eyebrow="How to Use" title="How to fold and use samosa sheets" copy="Follow the complete preparation method from thawing the sheets through folding, sealing and cooking." /><HowToUse /><JsonLd data={howToJsonLd} /></>;
}
