import { Activity, Wifi, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export const SystemHealth = ({ offline }: { offline: boolean }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  const latency = 18 + ((tick * 7) % 12);

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-4 text-xs">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${offline ? "bg-warning animate-ping" : "bg-success animate-ping"}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${offline ? "bg-warning" : "bg-success"}`} style={{ boxShadow: offline ? "0 0 10px hsl(var(--warning))" : "0 0 10px hsl(var(--success))" }}></span>
        </span>
        <span className="font-mono uppercase tracking-wider text-foreground/80">
          {offline ? "OFFLINE" : "OPERATIONAL"}
        </span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
        <Activity className="h-3.5 w-3.5 text-primary" />
        <span>{latency}ms</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
        <Wifi className="h-3.5 w-3.5 text-primary" />
        <span>{offline ? "CACHE" : "5G"}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span>SECURE</span>
      </div>
    </div>
  );
};
