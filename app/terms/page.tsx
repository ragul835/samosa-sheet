import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Terms & Conditions", `Read ${site.name}'s terms for samosa sheet enquiries, order confirmation, product information and delivery.`, "/terms/", false);

export default function Terms() {
  return <main className="min-h-screen bg-cream py-8 sm:py-16"><article className="container-shell max-w-3xl rounded-2xl bg-white p-5 shadow-soft sm:p-10">
    <Link href="/" className="font-semibold text-leaf-700">← Back to home</Link>
    <h1 className="mt-8 text-3xl font-bold sm:text-4xl">Terms & Conditions</h1><p className="mt-3 text-sm text-gray-500">Last updated: September 5, 2026</p>
    <div className="mt-8 space-y-7 leading-7 text-gray-700">
      <section><h2 className="text-xl font-bold text-gray-900">Enquiries and orders</h2><p className="mt-2">Website content is provided for general product information. An order is confirmed only after {site.name} accepts the requested quantity, price, availability, delivery location and payment terms through direct communication.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">Product information</h2><p className="mt-2">Always follow the storage, shelf-life, allergen and preparation instructions printed on the supplied packaging. Product availability, packaging and specifications may change; confirmed order details take precedence over general website information.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">Delivery and returns</h2><p className="mt-2">Delivery coverage, timing, minimum quantities, inspection and return eligibility are agreed during order confirmation. Please report damaged or incorrect goods promptly with order details and photographs where applicable.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">Contact</h2><p className="mt-2">Questions about these terms can be sent to <a className="font-semibold text-leaf-700" href={`mailto:${site.email}`}>{site.email}</a>.</p></section>
    </div>
  </article></main>;
}
