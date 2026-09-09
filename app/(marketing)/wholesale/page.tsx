import type { Metadata } from "next";
import Wholesale from "@/components/Wholesale";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Wholesale Samosa Sheet Supplier in India", description: "Request wholesale samosa sheet supply details for restaurants, hotels, caterers, retailers, manufacturers and distributors across India.", alternates: { canonical: "/wholesale/" } };
export default function WholesalePage() { return <><PageIntro eyebrow="Bulk Orders" title="Wholesale supply for growing kitchens" copy="Tell us the product, quantity and supply frequency you need, and receive pricing through WhatsApp." /><Wholesale /></>; }
