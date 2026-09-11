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
          <h2 className="section-title">Our Samosa Sheet Range</h2>
          <p className="section-copy mx-auto">Choose the right sheet size for home, restaurant, catering or commercial requirements. For recurring orders, see our <Link href="/wholesale/" className="font-semibold text-leaf-700 underline underline-offset-4">wholesale samosa sheet supply</Link>. New to samosa patti? Learn <Link href="/how-to-use/" className="font-semibold text-leaf-700 underline underline-offset-4">how to fold and seal the sheets</Link>.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(p => (
            <article id={`product-${p.id}`} key={p.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-52 overflow-hidden bg-brand-50"><Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /></div>
              <div className="p-5 sm:p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{p.description}</p>
                <dl className="mt-5 space-y-2 text-sm">
                  {[["Size",p.size],["Pack",p.quantity],["Best for",p.bestFor],["Storage",p.storage]].map(([a,b]) =>
                    <div key={a} className="flex items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">{a}</dt><dd className="min-w-0 break-words text-right font-semibold">{b}</dd></div>
                  )}
                </dl>
                <OrderWhatsAppButton productId={p.id} ariaLabel={`Order ${p.name} on WhatsApp`} className="btn-whatsapp mt-6 w-full">
                  <MessageCircle size={18} aria-hidden="true"/> Order on WhatsApp
                </OrderWhatsAppButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
