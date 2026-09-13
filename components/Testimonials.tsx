const testimonials = [
  ["Good quality sheets and very easy to use. The samosas become crispy and consistent.","Restaurant Owner"],
  ["Very useful for bulk preparation and saves a lot of kitchen time.","Catering Business"],
  ["Packaging and sheet quality are excellent.","Retail Customer"]
];
export default function Testimonials() {
  return (
    <section className="section bg-cream"><div className="container-shell"><div className="text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Trusted in busy kitchens</p><h2 className="section-title">What Our Customers Say</h2></div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">{testimonials.map(([q,c], index) => <figure key={c} className={`rounded-3xl border p-7 shadow-[0_16px_45px_rgba(52,42,26,0.07)] ${index === 1 ? "border-leaf-800 bg-leaf-800 text-white md:-translate-y-3" : "border-stone-200/70 bg-white"}`}><div className={index === 1 ? "text-brand-500" : "text-brand-600"} aria-label="5 out of 5 stars">★★★★★</div><blockquote className={`mt-5 text-lg leading-8 ${index === 1 ? "text-green-50" : "text-gray-700"}`}>“{q}”</blockquote><figcaption className={`mt-6 text-sm font-bold uppercase tracking-wider ${index === 1 ? "text-green-100" : "text-leaf-800"}`}>{c}</figcaption></figure>)}</div>
    </div></section>
  );
}
