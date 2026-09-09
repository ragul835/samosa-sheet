import type { Metadata } from "next";
import About from "@/components/About";
import Benefits from "@/components/Benefits";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About Our Samosa Sheets", description: "Learn about our focus on fresh, consistent and hygienically packed ready-made samosa sheets for retail and wholesale customers across India.", alternates: { canonical: "/about/" } };
export default function AboutPage() { return <><PageIntro eyebrow="About" title="Reliable quality for everyday preparation" copy="We help homes and food businesses prepare consistent samosas with less kitchen time and effort." /><About /><Benefits /></>; }
