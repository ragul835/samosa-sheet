import type { Metadata } from "next";
import About from "@/components/About";
import Benefits from "@/components/Benefits";
import PageIntro from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata("About Our Chennai Samosa Sheet Business", `Learn about ${site.name} in Nerkundram, Chennai: ready-made samosa sheets for home kitchens, restaurants, caterers and wholesale buyers.`, "/about/");
export default function AboutPage() { return <><PageIntro path="/about/" eyebrow="About" title="Samosa sheet supply from Chennai" copy="We help homes and food businesses prepare consistent samosas with less kitchen time and effort." /><About /><Benefits /></>; }
