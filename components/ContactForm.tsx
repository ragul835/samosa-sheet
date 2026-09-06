"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, ShoppingBag } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { emailThenOpenWhatsApp, enquiryEmailEnabled } from "@/lib/enquiry";
import { logEvent } from "@/lib/logger";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20";

export default function ContactForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enquiryType, setEnquiryType] = useState("");

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const submittedEnquiryType = String(form.get("enquiryType") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const website = String(form.get("website") ?? "");
    const phoneDigits = phone.replace(/\D/g, "");
    const enquiryTypeValue = submittedEnquiryType || "Not specified";
    const messageValue = message || "Not provided";

    if (name.length < 2) {
      logEvent("warn", "contact_validation_failed", { field: "name" });
      setError("Please enter your name.");
      return;
    }
    if (!/^\d{10,15}$/.test(phoneDigits)) {
      logEvent("warn", "contact_validation_failed", { field: "phone" });
      setError("Please enter a valid phone number with 10–15 digits.");
      return;
    }
    const url = waLink(`Hello ${site.name},

I would like to make an enquiry.

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Enquiry type: ${enquiryTypeValue}

Message:
${messageValue}`);
    setSubmitting(true);
    try {
      await emailThenOpenWhatsApp({ kind: "Contact enquiry", website, fields: {
        Name: name, Phone: phone, Email: email || "Not provided", "Enquiry type": enquiryTypeValue, Message: messageValue,
      } }, url);
    } catch {
      setError("We could not submit your enquiry. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section bg-white" aria-labelledby="contact-form-title">
      <div className="container-shell grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Send an enquiry</span>
          <h2 id="contact-form-title" className="section-title mt-3">How can we help?</h2>
          <p className="section-copy">Share your requirement and continue to WhatsApp with a complete, ready-to-send message.</p>
          <div className="mt-7 rounded-2xl bg-green-50 p-5 text-sm leading-6 text-green-950">
            <div className="flex items-center gap-2 font-bold"><MessageCircle aria-hidden="true" size={18} />Direct response</div>
            <p className="mt-2 text-green-900/75">Your enquiry opens directly with our team at {site.whatsappDisplay}. You can review it before sending.</p>
          </div>
        </div>

        <form onSubmit={submitContact} className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-soft sm:rounded-3xl sm:p-8">
          <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-800">Your name <span aria-hidden="true" className="text-red-600">*</span>
              <input name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required className={fieldClass} placeholder="Full name" />
            </label>
            <label className="text-sm font-semibold text-gray-800">Phone number <span aria-hidden="true" className="text-red-600">*</span>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} required className={fieldClass} placeholder="e.g. 98765 43210" />
            </label>
            <label className="text-sm font-semibold text-gray-800">Email address <span className="font-normal text-gray-500">(optional)</span>
              <input name="email" type="email" autoComplete="email" maxLength={150} className={fieldClass} placeholder="you@example.com" />
            </label>
            <label className="text-sm font-semibold text-gray-800">Enquiry type <span className="font-normal text-gray-500">(optional)</span>
              <select name="enquiryType" value={enquiryType} onChange={(event) => setEnquiryType(event.target.value)} className={fieldClass}>
                <option value="">Select an option</option>
                <option>Product information</option>
                <option>Retail order</option>
                <option>Wholesale or bulk order</option>
                <option>Delivery information</option>
                <option>Distributor enquiry</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          {enquiryType === "Retail order" && (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5" role="status">
              <div className="flex items-start gap-3">
                <ShoppingBag className="mt-0.5 shrink-0 text-green-700" size={22} aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-green-950">Ready to place an order?</h3>
                  <p className="mt-1 text-sm leading-6 text-green-900/80">Use the product order form to choose a product, quantity and delivery address.</p>
                  <OrderWhatsAppButton className="btn-whatsapp mt-4 w-full sm:w-auto">Start product order</OrderWhatsAppButton>
                </div>
              </div>
            </div>
          )}

          <label className="mt-5 block text-sm font-semibold text-gray-800">Your message <span className="font-normal text-gray-500">(optional)</span>
            <textarea name="message" rows={5} minLength={10} maxLength={1000} className={`${fieldClass} py-3`} placeholder="Tell us which product, quantity or information you need." />
          </label>

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-whatsapp mt-6 w-full text-center disabled:cursor-wait disabled:opacity-70 sm:w-auto">
            <Send aria-hidden="true" size={18} /> {submitting ? "Submitting…" : enquiryEmailEnabled ? "Send enquiry & open WhatsApp" : "Continue to WhatsApp"}
          </button>
          <p className="mt-4 text-xs leading-5 text-gray-500">By continuing, you choose to share these details through WhatsApp. See our <Link href="/privacy-policy/" className="font-semibold text-leaf-700 hover:underline">Privacy Policy</Link>.</p>
        </form>
      </div>
    </section>
  );
}
