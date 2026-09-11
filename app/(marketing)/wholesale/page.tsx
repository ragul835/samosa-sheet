import type { Metadata } from "next";
import Wholesale from "@/components/Wholesale";
import PageIntro from "@/components/PageIntro";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Wholesale Samosa Sheets & Patti in India", "Request bulk samosa sheet pricing from our Chennai team. Supply enquiries for restaurants, caterers, hotels, retailers and distributors across India.", "/wholesale/");
export default function WholesalePage() { return <><PageIntro path="/wholesale/" eyebrow="Bulk Orders" title="Wholesale samosa sheets for food businesses" copy="Tell us the sheet size, quantity, delivery location and supply frequency you need. Our Chennai team will confirm bulk pricing and availability through WhatsApp." /><Wholesale /></>; }
