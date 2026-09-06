import { BadgeCheck, Box, Clock3, Refrigerator, ShieldCheck, Sparkles } from "lucide-react";
const items = [
  [Clock3,"Ready to Use","No need to prepare dough manually. Save valuable preparation time."],
  [BadgeCheck,"Consistent Quality","Uniform thickness and size for dependable cooking results."],
  [Sparkles,"Crispy Results","Designed to help create delicious, crispy samosas."],
  [ShieldCheck,"Hygienically Packed","Prepared and packed with proper hygiene standards."],
  [Box,"Bulk Supply","Suitable for restaurants, caterers, hotels and distributors."],
  [Refrigerator,"Easy Storage","Convenient refrigerated or frozen storage."]
];
export default function Benefits() {
  return (
    <section id="benefits" className="section bg-cream">
      <div className="container-shell">
        <div className="text-center"><h2 className="section-title">Why Choose Our Samosa Sheets?</h2><p className="section-copy mx-auto">Made for convenience, consistency and reliable food preparation.</p></div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([Icon,title,copy]) => { const C = Icon as typeof Clock3; return (
            <div key={String(title)} className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700"><C size={24}/></div>
              <h3 className="mt-5 text-lg font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{String(copy)}</p>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
