import { Check, ChefHat, PlayCircle } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Thaw the sheets",
    copy: "Take out only what you need and let the sheets soften at room temperature. Keep the rest covered so they do not dry out.",
  },
  {
    number: "02",
    title: "Prepare the filling",
    copy: "Cook your favourite potato, vegetable, paneer or meat filling. Let it cool completely before wrapping.",
  },
  {
    number: "03",
    title: "Make a cone",
    copy: "Fold one sheet into a cone and overlap the edge. Handle it gently to keep every layer smooth and intact.",
  },
  {
    number: "04",
    title: "Fill the samosa",
    copy: "Add 1–2 tablespoons of filling. Leave enough room at the top so the samosa closes without splitting.",
  },
  {
    number: "05",
    title: "Fold and seal",
    copy: "Brush the open edge with a thick flour-and-water paste, fold it over and press firmly to seal.",
  },
  {
    number: "06",
    title: "Cook until golden",
    copy: "Deep-fry on medium heat until crisp and golden, or brush lightly with oil and air-fry until evenly browned.",
  },
];

const quickTips = [
  "Use a cool, fairly dry filling to keep the sheets crisp.",
  "Keep unused sheets under a clean, slightly damp cloth.",
  "Do not overfill—this makes sealing and frying easier.",
];

export default function HowToUse() {
  return (
    <section id="how-to-use" className="section overflow-hidden bg-amber-50/60">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-4 py-2 text-sm font-bold text-green-900">
            <ChefHat aria-hidden="true" className="h-4 w-4" />
            From sheet to samosa
          </span>
          <h2 className="section-title mt-5">Perfect samosas, step by step</h2>
          <p className="section-copy mx-auto">
            Follow this simple method for neat folds, a secure seal and a crisp golden finish every time.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="group relative rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-4xl font-black text-brand-500" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.copy}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid overflow-hidden rounded-3xl bg-green-950 shadow-xl lg:grid-cols-[1.4fr_0.6fr]">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3 text-white">
              <PlayCircle aria-hidden="true" className="h-6 w-6 text-brand-500" />
              <div>
                <h3 className="text-xl font-bold">Watch the folding technique</h3>
                <p className="mt-1 text-sm text-green-100/75">A practical visual guide to shaping samosas with ready-made sheets.</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/watch?v=DbwGhWJ-IsU"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch the samosa folding technique on YouTube (opens in a new tab)"
              className="group relative block aspect-video overflow-hidden rounded-2xl bg-black shadow-inner focus-visible:outline-white"
            >
              <Image
                src="/images/samosa-sheet-rectangle-folding-v2.webp"
                alt="Hands folding a rectangular samosa sheet around vegetable filling"
                fill
                loading="lazy"
                sizes="(max-width: 1023px) calc(100vw - 3rem), 720px"
                className="object-cover transition duration-500 group-hover:scale-[1.025]"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-white/95 text-leaf-900 shadow-2xl transition duration-300 group-hover:scale-105 group-hover:bg-brand-500">
                  <PlayCircle className="h-8 w-8" aria-hidden="true" />
                </span>
              </span>
              <span className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 text-sm font-bold text-white">
                <span>See the complete folding guide</span>
                <span className="rounded-full border border-white/30 bg-black/35 px-3 py-1.5 backdrop-blur-sm">Watch on YouTube ↗</span>
              </span>
            </a>
          </div>

          <aside className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-label="Samosa preparation tips">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-500">Before you begin</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Three tips for the best result</h3>
            <ul className="mt-7 space-y-5">
              {quickTips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-6 text-green-50/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-green-950">
                    <Check aria-hidden="true" className="h-4 w-4" />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-5 text-green-100/60">
              Cooking times vary by appliance and filling. Always ensure meat fillings are fully cooked before serving.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
