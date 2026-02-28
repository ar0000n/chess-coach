const testimonials = [
  {
    quote:
      "I've been stuck at 1500 Blitz for two years. One debrief and I finally understood I was hanging my rooks on open files almost every game. Fixed it in a week.",
    name: "Marcus T.",
    detail: "Lichess · 1512 Blitz",
  },
  {
    quote:
      "The opening adjustment section alone was worth it. I had no idea my Caro-Kann sideline was dropping a tempo that my opponents kept exploiting.",
    name: "Sarah K.",
    detail: "Chess.com · 1788 Rapid",
  },
  {
    quote:
      "The weekly puzzle plan is exactly what I needed. Instead of randomly grinding tactics, I'm targeting my specific weaknesses. My rating went up 80 points this month.",
    name: "Daniel R.",
    detail: "Lichess · 1650 Rapid",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-[#0d0d0f]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#f1f1f3]">
            Players who stopped guessing and started improving
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map(({ quote, name, detail }) => (
            <div
              key={name}
              className="rounded-xl border border-[#2e2e36] bg-[#111113] p-5"
            >
              <p className="text-sm text-[#94a3b8] leading-relaxed italic mb-4">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="border-t border-[#2e2e36] pt-4">
                <p className="text-sm font-semibold text-[#f1f1f3]">{name}</p>
                <p className="text-xs text-[#4a4a56] mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
