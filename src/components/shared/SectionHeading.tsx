export function SectionHeading({ eyebrow, title, align = "left" }: { eyebrow: string; title: string; align?: "left" | "center" }) {
  return <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-coffee">{eyebrow}</p><h2 className="font-display text-4xl leading-[1.05] text-espresso sm:text-5xl">{title}</h2></div>;
}
