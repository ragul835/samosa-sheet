import type { Metadata } from "next";
import Products from "@/components/Products";
import PageIntro from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Ready-Made Samosa Sheet Products | ${site.name}`, description: "Explore small, medium and large ready-made samosa sheets for homes, restaurants, catering and commercial kitchens.", alternates: { canonical: "/products/" } };
export default function ProductsPage() { return <><PageIntro eyebrow="Products" title="Samosa sheets for every kitchen" copy="Choose the right ready-made sheet size for snacks, regular service or high-volume preparation." /><Products /></>; }
