import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { directionsLink, mapsEmbedLink, site } from "@/lib/site";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
export default function Contact() {
  return (
    <section id="contact" className="section bg-gray-50"><div className="container-shell">
      <h2 className="section-title">Get in Touch</h2><p className="section-copy">Contact us for retail, bulk and distributor enquiries.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <div className="space-y-5">{[
            [Phone,"Phone",site.phoneDisplay],[MessageCircle,"WhatsApp",site.whatsappDisplay],[Mail,"Email",site.email],[MapPin,"Address",site.address],[Clock,"Business Hours",site.hours]
          ].map(([Icon,l,v]) => { const C=Icon as typeof Phone; return <div key={String(l)} className="flex min-w-0 gap-3 sm:gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700"><C size={20}/></div><div className="min-w-0"><div className="text-sm text-gray-500">{String(l)}</div><div className="break-words font-semibold">{String(v)}</div></div></div>})}</div>
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap"><a href={`tel:${site.phone}`} className="btn-secondary w-full sm:w-auto">Call Now</a><OrderWhatsAppButton className="btn-whatsapp w-full sm:w-auto">Order on WhatsApp</OrderWhatsAppButton><a href={directionsLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">Get Directions</a></div>
        </div>
        <div className="min-h-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft"><iframe title={`${site.name} location map`} src={mapsEmbedLink} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[360px] w-full border-0" /></div>
      </div>
    </div></section>
  );
}
