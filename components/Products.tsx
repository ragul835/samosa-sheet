import { MessageCircle } from "lucide-react";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";

export default function Products() {
  return (
    <section id="products" className="section bg-white">
      <div className="container-shell">
        <div className="text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Three sizes · One dependable standard</p>
          <h2 className="section-title">Our Samosa Sheet Range</h2>
          <p className="section-copy mx-auto">Choose the right sheet size for home, restaurant, catering or commercial requirements. For recurring orders, see our <Link href="/wholesale/" className="font-semibold text-leaf-700 underline underline-offset-4">wholesale samosa sheet supply</Link>. New to samosa patti? Learn <Link href="/how-to-use/" className="font-semibold text-leaf-700 underline underline-offset-4">how to fold and seal the sheets</Link>.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(p => (
            <article id={`product-${p.id}`} key={p.id} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-[#fffefa] shadow-[0_18px_50px_rgba(52,42,26,0.07)] transition duration-500 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_28px_70px_rgba(52,42,26,0.13)]">
              <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
                <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 2.25rem), 405px" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-xs font-bold tracking-wide text-leaf-900 shadow-sm backdrop-blur-md">{p.size}</span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{p.description}</p>
                <dl className="mt-5 space-y-2 text-sm">
                  {[["Size",p.size],["Pack",p.quantity],["Best for",p.bestFor],["Storage",p.storage]].map(([a,b]) =>
                    <div key={a} className="flex items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">{a}</dt><dd className="min-w-0 break-words text-right font-semibold">{b}</dd></div>
                  )}
                </dl>
                <div className="mt-auto pt-6">
                  <OrderWhatsAppButton productId={p.id} ariaLabel={`Order ${p.name} on WhatsApp`} className="btn-whatsapp w-full">
                    <MessageCircle size={18} aria-hidden="true"/> Order on WhatsApp
                  </OrderWhatsAppButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
