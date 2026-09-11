import type { Metadata } from "next";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Contact Our Chennai Samosa Sheet Supplier", `Contact ${site.name} in Nerkundram, Chennai for samosa sheet prices, retail orders, wholesale enquiries and delivery availability.`, "/contact/");
export default function ContactPage() { return <><PageIntro path="/contact/" eyebrow="Contact" title="Contact our Chennai samosa sheet team" copy="Call, email, message us on WhatsApp or visit our Nerkundram location for retail and bulk enquiries." /><ContactForm /><Contact /><FAQ /></>; }
