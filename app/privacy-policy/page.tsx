import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Privacy Policy", `How ${site.name} handles contact details, order enquiries and third-party services.`, "/privacy-policy/", false);

export default function PrivacyPolicy() {
  return <main className="min-h-screen bg-cream py-8 sm:py-16"><article className="container-shell max-w-3xl rounded-2xl bg-white p-5 shadow-soft sm:p-10">
    <Link href="/" className="font-semibold text-leaf-700">← Back to home</Link>
    <h1 className="mt-8 text-3xl font-bold sm:text-4xl">Privacy Policy</h1><p className="mt-3 text-sm text-gray-500">Last updated: September 5, 2026</p>
    <div className="mt-8 space-y-7 leading-7 text-gray-700">
      <section><h2 className="text-xl font-bold text-gray-900">Information we receive</h2><p className="mt-2">When you contact {site.name} by phone, email, or WhatsApp, we may receive the details you choose to provide, such as your name, phone number, location, business name, product requirements and delivery enquiry.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">How we use it</h2><p className="mt-2">We use enquiry information only to respond, provide product or wholesale details, coordinate orders and delivery, and maintain necessary business records. This website does not create customer accounts or process online payments.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">Third-party services</h2><p className="mt-2">We use Cloudflare to securely receive and queue website enquiries and Resend to send the resulting email notification. WhatsApp, telephone, email and Google Maps are also third-party services with their own privacy terms. These providers may process information under their respective policies.</p></section>
      <section><h2 className="text-xl font-bold text-gray-900">Contact</h2><p className="mt-2">For a privacy question or correction request, email <a className="font-semibold text-leaf-700" href={`mailto:${site.email}`}>{site.email}</a>.</p></section>
    </div>
  </article></main>;
}
