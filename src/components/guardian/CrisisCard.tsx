import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrisisCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  active: boolean;
  variant: "fire" | "accident" | "unsafe";
  onClick: () => void;
}

const variantStyles = {
  fire: {
    glow: "hsl(0 95% 55% / 0.25)",
    iconWrap: "bg-destructive/10 text-destructive border-destructive/40",
    activeBorder: "border-destructive shadow-[0_0_40px_hsl(0_95%_55%/0.5)]",
  },
  accident: {
    glow: "hsl(38 100% 55% / 0.25)",
    iconWrap: "bg-warning/10 text-warning border-warning/40",
    activeBorder: "border-warning shadow-[0_0_40px_hsl(38_100%_55%/0.5)]",
  },
  unsafe: {
    glow: "hsl(280 100% 60% / 0.25)",
    iconWrap: "bg-primary/10 text-primary border-primary/40",
    activeBorder: "border-primary shadow-[0_0_40px_hsl(187_100%_50%/0.5)]",
  },
};

export const CrisisCard = ({ icon: Icon, title, subtitle, active, variant, onClick }: CrisisCardProps) => {
  const styles = variantStyles[variant];
  return (
    <button
      onClick={onClick}
      style={{ ["--card-glow" as string]: styles.glow }}
      className={cn(
        "crisis-card press-effect group p-6 text-left",
        active && styles.activeBorder,
        active && "active"
      )}
    >
      {/* corner ticks */}
      <span className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/60" />

      <div className={cn("relative w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110", styles.iconWrap)}>
        <Icon className="h-8 w-8" strokeWidth={1.8} />
        {active && <span className="absolute inset-0 rounded-2xl animate-pulse-ring-cyan" />}
      </div>

      <div className="font-mono text-xs text-muted-foreground tracking-[0.3em] mb-1">PROTOCOL</div>
      <h3 className="text-3xl font-bold tracking-wider mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>

      <div className="mt-5 flex items-center gap-2 text-xs font-mono text-primary/80">
        <span className="h-1 w-8 bg-primary/60" />
        <span>TAP TO ACTIVATE</span>
      </div>
    </button>
  );
};
