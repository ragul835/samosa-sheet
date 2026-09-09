import type { Metadata } from "next";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Our Chennai Office", description: `Contact ${site.name} in Nerkundram, Chennai for retail orders, wholesale enquiries and delivery information across India.`, alternates: { canonical: "/contact/" } };
export default function ContactPage() { return <><PageIntro eyebrow="Contact" title="Let’s talk about your requirement" copy="Call, email, message us on WhatsApp or visit our Nerkundram location for retail and bulk enquiries." /><ContactForm /><Contact /><FAQ /></>; }
