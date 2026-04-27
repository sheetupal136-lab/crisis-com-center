import { Cpu, Mic, Activity, Network, Signal, CheckCircle2, Clock } from "lucide-react";
import esp32 from "@/assets/esp32-core.jpg";

const features = [
  { icon: Mic, label: "Noise Trigger Distress Detection", status: "active" },
  { icon: Activity, label: "Impact-Sensor Trigger", status: "active" },
  { icon: Network, label: "Mesh Networking (No internet required)", status: "active" },
  { icon: Signal, label: "GSM Fail-safe Module", status: "standby" },
] as const;

export const HardwareCore = () => {
  return (
    <section
      className="glass rounded-2xl p-6 border-2 border-primary/40 relative overflow-hidden"
      style={{ boxShadow: "var(--glow-cyan)" }}
    >
      {/* corner ticks */}
      <span className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/60" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/50 flex items-center justify-center" style={{ boxShadow: "var(--glow-cyan)" }}>
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-mono text-muted-foreground tracking-widest">HARDWARE SYNC HUB</div>
            <h3 className="text-xl font-bold tracking-wider neon-text-cyan">ESP32 CORE</h3>
          </div>
        </div>
        <div className="text-xs font-mono text-success flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" style={{ boxShadow: "var(--glow-success)" }} />
          MESH OPERATIONAL
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-[hsl(222_50%_5%)] aspect-square max-w-md mx-auto w-full">
          <img
            src={esp32}
            alt="ESP32 microcontroller chip with glowing blue core and mesh network visualization"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full h-full object-cover"
          />
          {/* central pulse */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse-ring-cyan" />
          </div>
          {/* scan line */}
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
          {/* label */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px]">
            <span className="px-2 py-1 rounded bg-background/70 border border-success/40 text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              MESH OPERATIONAL
            </span>
            <span className="px-2 py-1 rounded bg-background/70 border border-primary/40 text-primary">
              ESP32-WROOM · v2.1
            </span>
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-3">FEATURES</div>
          <ul className="space-y-2.5">
            {features.map((f, i) => {
              const isActive = f.status === "active";
              return (
                <li
                  key={i}
                  className={`group flex items-center gap-3 rounded-xl p-3 border transition-all ${
                    isActive
                      ? "border-success/40 bg-success/5 hover:bg-success/10"
                      : "border-warning/40 bg-warning/5 hover:bg-warning/10"
                  }`}
                >
                  <div
                    className={`relative w-10 h-10 rounded-lg flex items-center justify-center border ${
                      isActive ? "bg-success/15 border-success/50 text-success" : "bg-warning/15 border-warning/50 text-warning"
                    }`}
                  >
                    <f.icon className="h-4 w-4" />
                    {isActive && <span className="absolute inset-0 rounded-lg animate-pulse-ring-cyan" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className={`text-[10px] font-mono uppercase tracking-widest ${isActive ? "text-success" : "text-warning"}`}>
                      {isActive ? "● ACTIVE" : "◌ STANDBY"}
                    </div>
                  </div>
                  {isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "NODES", val: "12" },
              { label: "UPTIME", val: "99.8%" },
              { label: "LATENCY", val: "8ms" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg bg-secondary/40 border border-border p-2">
                <div className="text-[9px] font-mono text-muted-foreground tracking-widest">{s.label}</div>
                <div className="text-sm font-bold neon-text-cyan font-mono">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
