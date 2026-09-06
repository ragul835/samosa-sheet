import type { Metadata } from "next";
import HowToUse from "@/components/HowToUse";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `How to Use Samosa Sheets | ${site.name}`, description: "Learn how to thaw, fill, fold, seal and cook ready-made samosa sheets with a clear step-by-step guide and video.", alternates: { canonical: "/how-to-use/" } };
export default function HowToUsePage() { return <><PageIntro eyebrow="How to Use" title="Make crisp samosas with confidence" copy="Follow the complete preparation method from thawing the sheets through folding, sealing and cooking." /><HowToUse /></>; }
