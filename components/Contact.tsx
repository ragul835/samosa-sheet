import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { directionsLink, mapEmbedLink, site } from "@/lib/site";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
export default function Contact() {
  return (
    <section id="contact" className="section bg-gray-50"><div className="container-shell">
      <h2 className="section-title">Get in Touch</h2><p className="section-copy">Contact us for retail, bulk and distributor enquiries.</p>
      <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2">
        <div className="min-w-0 rounded-3xl border border-stone-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(52,42,26,0.07)] sm:p-7">
          <div className="space-y-5">{[
            [Phone,"Phone",site.phoneDisplay],[MessageCircle,"WhatsApp",site.whatsappDisplay],[Mail,"Email",site.email],[MapPin,"Address",site.address],[Clock,"Business Hours",site.hours]
          ].map(([Icon,l,v]) => { const C=Icon as typeof Phone; return <div key={String(l)} className="flex min-w-0 gap-3 sm:gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700"><C size={20}/></div><div className="min-w-0"><div className="text-sm text-gray-500">{String(l)}</div><div className="break-words font-semibold">{String(v)}</div></div></div>})}</div>
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap"><a href={`tel:${site.phone}`} className="btn-secondary w-full sm:w-auto">Call Now</a><OrderWhatsAppButton className="btn-whatsapp w-full sm:w-auto">Order on WhatsApp</OrderWhatsAppButton><a href={directionsLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">Get Directions</a></div>
        </div>
        <div className="relative min-h-[400px] overflow-hidden rounded-3xl border border-stone-200/70 bg-stone-100 shadow-[0_24px_70px_rgba(5,46,22,0.18)]">
          <iframe
            src={mapEmbedLink}
            title={`Google Maps location of ${site.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-16 sm:p-6 sm:pt-20">
            <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="pointer-events-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-leaf-900 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-leaf-900 sm:w-fit">
              <Navigation aria-hidden="true" size={18} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div></section>
  );
}
