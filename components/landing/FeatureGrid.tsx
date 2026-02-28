import { Search, CalendarDays, BookOpen, Target } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "3 Recurring Weaknesses Identified",
    description:
      "The AI analyzes up to 50 of your games to find the patterns that keep costing you points — not random blunders, but structural issues in your play.",
  },
  {
    icon: CalendarDays,
    title: "Day-by-Day Puzzle Plan",
    description:
      "Get a curated Monday–Friday training schedule with specific Lichess puzzle themes mapped directly to your weaknesses.",
  },
  {
    icon: BookOpen,
    title: "Opening Adjustments",
    description:
      "Pinpoint which move in your repertoire is creating the problems, with specific changes to your opening choices based on your game data.",
  },
  {
    icon: Target,
    title: "Measurable Weekly Goal",
    description:
      "Every debrief ends with one concrete, verifiable goal so you know exactly what improvement looks like this week.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#10B981] mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f1f3] leading-tight">
            A full coaching session — in under a minute
          </h2>
          <p className="mt-4 text-[#7a7a8c] max-w-lg mx-auto">
            Import your recent games, and receive the kind of structured feedback
            you&apos;d only get from a private coach.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-[#2e2e36] bg-[#111113] p-6 transition-all duration-300 hover:border-[#10B981]/30 hover:bg-[#131316]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 group-hover:bg-[#10B981]/15 transition-colors">
                <Icon size={20} className="text-[#10B981]" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-[#f1f1f3]">{title}</h3>
              <p className="text-sm text-[#7a7a8c] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
