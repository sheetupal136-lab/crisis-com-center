import { BookOpen, Flame, Heart, ShieldAlert, Droplet } from "lucide-react";
import { useState } from "react";

const guides = [
  {
    icon: Flame,
    title: "Fire Emergency",
    color: "text-destructive",
    steps: [
      "Stay low — crawl under smoke",
      "Cover nose with damp cloth",
      "Use stairs, never elevators",
      "Feel doors before opening",
      "Call 101 once safe outside",
    ],
  },
  {
    icon: Heart,
    title: "CPR Basics",
    color: "text-warning",
    steps: [
      "Check responsiveness & breathing",
      "Place heel of hand on chest center",
      "Push hard, push fast (100-120/min)",
      "Compress 2 inches deep",
      "Continue until help arrives",
    ],
  },
  {
    icon: Droplet,
    title: "Severe Bleeding",
    color: "text-destructive",
    steps: [
      "Apply firm direct pressure",
      "Use clean cloth or gauze",
      "Elevate the wound if possible",
      "Do not remove embedded objects",
      "Keep victim warm — call 102",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Personal Safety",
    color: "text-primary",
    steps: [
      "Trust your instincts — leave",
      "Share live location with trusted contact",
      "Stay in well-lit, public areas",
      "Use loud whistle or alarm",
      "Dial 112 for any emergency",
    ],
  },
];

export const OfflineGuides = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="glass rounded-2xl p-6 mode-default">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-xs font-mono text-muted-foreground tracking-widest">OFFLINE MODE</div>
          <h3 className="text-xl font-bold">Cached Emergency Guides</h3>
        </div>
        <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded bg-warning/15 text-warning border border-warning/40">
          NO NETWORK · LOCAL DATA
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {guides.map((g, i) => {
          const Icon = g.icon;
          const active = open === i;
          return (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className={`press-effect text-left rounded-xl border p-4 transition-all ${
                active ? "border-primary bg-primary/5" : "border-border bg-secondary/30 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-5 w-5 ${g.color}`} />
                <span className="font-bold">{g.title}</span>
              </div>
              <ol className="space-y-1.5 text-sm">
                {g.steps.map((s, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="font-mono text-primary text-xs mt-0.5">{String(j + 1).padStart(2, "0")}</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </button>
          );
        })}
      </div>
    </div>
  );
};
