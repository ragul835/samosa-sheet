const testimonials = [
  ["Good quality sheets and very easy to use. The samosas become crispy and consistent.","Restaurant Owner"],
  ["Very useful for bulk preparation and saves a lot of kitchen time.","Catering Business"],
  ["Packaging and sheet quality are excellent.","Retail Customer"]
];
export default function Testimonials() {
  return (
    <section className="section bg-cream"><div className="container-shell"><div className="text-center"><h2 className="section-title">What Our Customers Say</h2></div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">{testimonials.map(([q,c]) => <figure key={c} className="rounded-2xl bg-white p-6 shadow-soft"><div className="text-brand-500">★★★★★</div><blockquote className="mt-4 leading-7 text-gray-700">“{q}”</blockquote><figcaption className="mt-5 text-sm font-semibold">{c}</figcaption></figure>)}</div>
    </div></section>
  );
}
