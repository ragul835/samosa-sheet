import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { directionsLink, site } from "@/lib/site";
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
        <div className="relative isolate min-h-[400px] overflow-hidden rounded-3xl bg-leaf-900 p-6 text-white shadow-[0_24px_70px_rgba(5,46,22,0.22)] sm:p-8">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div aria-hidden="true" className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-green-400/15 blur-3xl" />

          <div className="relative flex h-full min-h-[352px] flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-500">Our location</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-50 backdrop-blur-sm">Nerkundram · Chennai</span>
            </div>

            <div className="my-10">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-leaf-900 shadow-lg shadow-black/15">
                <MapPin aria-hidden="true" size={27} strokeWidth={2.25} />
              </div>
              <h3 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">Visit Karpagam Foods</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-green-100 sm:text-base">{site.address}</p>
            </div>

            <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-leaf-900 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-leaf-900 sm:w-fit">
              <Navigation aria-hidden="true" size={18} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div></section>
  );
}
