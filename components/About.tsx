import { Check } from "lucide-react";
import Image from "next/image";
export default function About() {
  return (
    <section id="about" className="section bg-gray-50">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-gradient-to-br from-green-100 to-brand-100 p-3 shadow-soft sm:p-5">
          <Image src="/images/samosa-sheet-production.png" alt="Hygienic samosa sheet preparation and packaging facility" width={1448} height={1086} sizes="(max-width: 1024px) 100vw, 50vw" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
        </div>
        <div>
          <span className="font-semibold uppercase tracking-widest text-brand-600">About Us</span>
          <h2 className="section-title mt-3">Quality Samosa Sheets Made for Everyday Convenience</h2>
          <p className="section-copy">We manufacture and supply high-quality ready-made samosa sheets for homes, restaurants, catering businesses, bakeries and food shops.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Freshness","Consistent Quality","Easy Preparation","Hygienic Packaging","Bulk Supply"].map(x => <div key={x} className="flex items-center gap-2 font-medium"><Check className="text-leaf-700" size={18}/>{x}</div>)}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-gray-200 pt-6 text-center sm:gap-3"><div><strong className="block text-xl text-leaf-700 sm:text-2xl">5+</strong><span className="text-[11px] leading-4 text-gray-500 sm:text-xs">Years experience</span></div><div><strong className="block text-xl text-leaf-700 sm:text-2xl">100+</strong><span className="text-[11px] leading-4 text-gray-500 sm:text-xs">Business customers</span></div><div><strong className="block text-xl text-leaf-700 sm:text-2xl">Bulk</strong><span className="text-[11px] leading-4 text-gray-500 sm:text-xs">Supply available</span></div></div>
        </div>
      </div>
    </section>
  );
}
