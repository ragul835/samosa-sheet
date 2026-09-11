"use client";

import { type FormEvent, useState } from "react";
import { Building2, MessageCircle, Send } from "lucide-react";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
import { products } from "@/data/products";
import { site, waLink } from "@/lib/site";
import { emailThenOpenWhatsApp, enquiryEmailEnabled } from "@/lib/enquiry";
import { logEvent } from "@/lib/logger";

const types = ["Restaurants", "Hotels", "Catering Services", "Tea Shops", "Bakeries", "Food Manufacturers", "Supermarkets", "Distributors"];
const fieldClass = "min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20";

export default function Wholesale() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const businessName = String(form.get("businessName") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const productId = Number(form.get("productId"));
    const quantity = Number(form.get("quantity"));
    const frequency = String(form.get("frequency") ?? "").trim();
    const website = String(form.get("website") ?? "");
    const selectedProduct = products.find((product) => product.id === productId);

    if (businessName.length < 2 || location.length < 3 || !selectedProduct || frequency.length < 2) {
      logEvent("warn", "bulk_validation_failed", { field: "details" });
      setError("Please complete all enquiry details.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
      logEvent("warn", "bulk_validation_failed", { field: "quantity" });
      setError("Enter a quantity between 1 and 10,000 packs.");
      return;
    }

    const url = waLink(`Hello ${site.name},

I would like to request a wholesale price.

Business name: ${businessName}
Location: ${location}
Product: ${selectedProduct.name}
Sheet size: ${selectedProduct.size}
Pack size: ${selectedProduct.quantity}
Required quantity: ${quantity} pack${quantity === 1 ? "" : "s"}
Required frequency: ${frequency}

Please share pricing, minimum order quantity and delivery details.`);
    setSubmitting(true);
    try {
      await emailThenOpenWhatsApp({ kind: "Bulk enquiry", website, fields: {
        "Business name": businessName, Location: location, Product: selectedProduct.name, "Sheet size": selectedProduct.size,
        "Pack size": selectedProduct.quantity, Quantity: `${quantity} pack${quantity === 1 ? "" : "s"}`, Frequency: frequency,
      } }, url);
    } catch {
      setError("We could not submit the enquiry. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="wholesale" className="section bg-leaf-800 text-white">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-brand-500">Wholesale Supply</span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Looking for Bulk Samosa Sheet Supply?</h2>
          <p className="mt-4 max-w-xl leading-7 text-green-100">Reliable bulk samosa sheet supply from Chennai for food businesses and distributors across South India and India.</p>
          <div className="mt-7 flex flex-wrap gap-2">{types.map((type) => <span key={type} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm">{type}</span>)}</div>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <a href="/wholesale/#bulk-enquiry" className="btn-primary w-full sm:w-auto">Request Wholesale Price</a>
            <OrderWhatsAppButton className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold transition hover:bg-white/10 sm:w-auto">
              <MessageCircle size={18} aria-hidden="true" /> Order on WhatsApp
            </OrderWhatsAppButton>
          </div>
        </div>

        <div id="bulk-enquiry" className="min-w-0 scroll-mt-32 rounded-2xl bg-white p-5 text-gray-900 shadow-soft sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700"><Building2 aria-hidden="true" /></div>
            <div><h3 className="font-bold">Bulk Enquiry Details</h3><p className="text-sm text-gray-500">Send these details on WhatsApp</p></div>
          </div>

          <form onSubmit={submitEnquiry} className="mt-6 space-y-3">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="sr-only" htmlFor="bulk-business-name">Business name</label>
            <input id="bulk-business-name" name="businessName" type="text" autoComplete="organization" minLength={2} maxLength={100} required placeholder="Business Name" className={fieldClass} />

            <label className="sr-only" htmlFor="bulk-location">Location</label>
            <input id="bulk-location" name="location" type="text" autoComplete="address-level2" minLength={3} maxLength={150} required placeholder="Location" className={fieldClass} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="sr-only" htmlFor="bulk-product">Product</label>
                <select id="bulk-product" name="productId" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select Product</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name} — {product.size}</option>)}
                </select>
              </div>
              <div>
                <label className="sr-only" htmlFor="bulk-quantity">Quantity in packs</label>
                <input id="bulk-quantity" name="quantity" type="number" inputMode="numeric" min={1} max={10000} step={1} required placeholder="Quantity (packs)" className={fieldClass} />
              </div>
            </div>

            <label className="sr-only" htmlFor="bulk-frequency">Required frequency</label>
            <select id="bulk-frequency" name="frequency" required defaultValue="" className={fieldClass}>
              <option value="" disabled>Required Frequency</option>
              <option>One-time order</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Fortnightly</option>
              <option>Monthly</option>
            </select>

            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-whatsapp mt-2 w-full disabled:cursor-wait disabled:opacity-70">
              <Send size={18} aria-hidden="true" /> {submitting ? "Submitting…" : enquiryEmailEnabled ? "Send enquiry & open WhatsApp" : "Submit on WhatsApp"}
            </button>
            <p className="text-center text-xs leading-5 text-gray-500">{enquiryEmailEnabled ? "We securely queue an email notification, then open WhatsApp for your confirmation." : "Review the prepared enquiry in WhatsApp, then tap Send."}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
