import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Samosa Sheet FAQs | ${site.name}`, description: "Answers to common questions about samosa sheet storage, preparation, ordering, delivery and wholesale supply.", alternates: { canonical: "/faq/" } };
export default function FAQPage() { return <><PageIntro eyebrow="FAQ" title="Frequently asked questions" copy="Find quick answers about using, storing and ordering our ready-made samosa sheets." /><FAQ /></>; }
