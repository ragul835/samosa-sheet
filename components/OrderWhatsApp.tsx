"use client";

import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { products } from "@/data/products";
import { orderWaLink, site } from "@/lib/site";
import { emailThenOpenWhatsApp, enquiryEmailEnabled } from "@/lib/enquiry";
import { logEvent } from "@/lib/logger";

type OrderContextValue = { openOrder: (productId?: number) => void };
const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<number>(products[0].id);
  const [quantity, setQuantity] = useState("1");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    logEvent("info", "order_modal_closed");
  };
  const openOrder = (selectedProductId?: number) => {
    setProductId(selectedProductId ?? products[0].id);
    setError("");
    setOpen(true);
    logEvent("info", "order_modal_opened", { productSelected: selectedProductId !== undefined });
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phoneDigits = customerPhone.replace(/\D/g, "");
    const packs = Number.parseInt(quantity, 10);
    if (!/^\d{10,15}$/.test(phoneDigits)) {
      logEvent("warn", "order_validation_failed", { field: "phone" });
      setError("Enter a valid customer phone number (10–15 digits).")
      return;
    }
    if (!Number.isInteger(packs) || packs < 1 || packs > 999) {
      logEvent("warn", "order_validation_failed", { field: "quantity" });
      setError("Enter a quantity between 1 and 999 packs.")
      return;
    }
    if (address.trim().length < 10) {
      logEvent("warn", "order_validation_failed", { field: "address" });
      setError("Enter a complete delivery address.")
      return;
    }

    const selectedProduct = products.find((product) => product.id === productId);
    if (!selectedProduct) {
      logEvent("warn", "order_validation_failed", { field: "product" });
      setError("Select a valid product.")
      return;
    }

    const url = orderWaLink(selectedProduct, {
      packs,
      customerPhone: customerPhone.trim(),
      address: address.trim(),
    });
    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    setSubmitting(true);
    try {
      await emailThenOpenWhatsApp({ kind: "Product order", website, fields: {
        Product: selectedProduct.name, "Sheet size": selectedProduct.size, "Pack size": selectedProduct.quantity,
        Quantity: `${packs} pack${packs === 1 ? "" : "s"}`, "Customer phone": customerPhone.trim(), "Delivery address": address.trim(),
      } }, url);
      close();
    } catch {
      setError("We could not submit the order. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <OrderContext.Provider value={{ openOrder }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-gray-950/65 p-3 backdrop-blur-sm sm:p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
          <section role="dialog" aria-modal="true" aria-labelledby="order-title" className="my-3 max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-2xl sm:my-8 sm:max-h-[calc(100dvh-4rem)] sm:rounded-3xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-green-700">Order via WhatsApp</p>
                <h2 id="order-title" className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">Enter delivery details</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">Your order request will open in WhatsApp and be addressed to {site.whatsappDisplay}.</p>
              </div>
              <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close order form" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"><X aria-hidden="true"/></button>
            </div>

            <form onSubmit={submitOrder} className="mt-6 space-y-4">
              <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="block text-sm font-semibold text-gray-800">Product
                <select value={productId} onChange={(event) => setProductId(Number(event.target.value))} required className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20">
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name} — {product.size}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-gray-800">Quantity (packs)
                <input type="number" inputMode="numeric" min="1" max="999" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"/>
              </label>
              <label className="block text-sm font-semibold text-gray-800">Your phone number
                <input type="tel" autoComplete="tel" placeholder="e.g. 98765 43210" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} required className="mt-2 min-h-12 w-full rounded-xl border border-gray-300 px-4 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"/>
              </label>
              <label className="block text-sm font-semibold text-gray-800">Delivery address
                <textarea autoComplete="street-address" rows={3} minLength={10} placeholder="House/shop, street, area, city and PIN code" value={address} onChange={(event) => setAddress(event.target.value)} required className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"/>
              </label>
              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-whatsapp w-full disabled:cursor-wait disabled:opacity-70"><MessageCircle size={19} aria-hidden="true"/> {submitting ? "Submitting…" : enquiryEmailEnabled ? "Email & continue to WhatsApp" : "Continue to WhatsApp"}</button>
              <p className="text-center text-xs leading-5 text-gray-500">{enquiryEmailEnabled ? "We email your request to our team, then open WhatsApp for your confirmation." : "Review the prepared request in WhatsApp, then tap Send."}</p>
            </form>
          </section>
        </div>
      )}
    </OrderContext.Provider>
  );
}

export function OrderWhatsAppButton({ productId, className, children, ariaLabel, onClick }: { productId?: number; className: string; children: ReactNode; ariaLabel?: string; onClick?: () => void }) {
  const context = useContext(OrderContext);
  if (!context) throw new Error("OrderWhatsAppButton must be used within OrderProvider.");
  return <button type="button" className={className} aria-label={ariaLabel} onClick={() => { onClick?.(); context.openOrder(productId); }}>{children}</button>;
}
