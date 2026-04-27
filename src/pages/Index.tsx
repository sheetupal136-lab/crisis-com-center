import { useEffect, useMemo, useState } from "react";
import { Flame, Car, ShieldAlert, Shield, Send, Power, WifiOff } from "lucide-react";
import { SystemHealth } from "@/components/guardian/SystemHealth";
import { CrisisCard } from "@/components/guardian/CrisisCard";
import { FirePanel } from "@/components/guardian/FirePanel";
import { AccidentPanel } from "@/components/guardian/AccidentPanel";
import { UnsafePanel } from "@/components/guardian/UnsafePanel";
import { OfflineGuides } from "@/components/guardian/OfflineGuides";
import { GeoZone } from "@/components/guardian/GeoZone";
import { HardwareCore } from "@/components/guardian/HardwareCore";
import { DialerProvider } from "@/contexts/DialerContext";

type Mode = "fire" | "accident" | "unsafe" | null;

const detectMode = (text: string): Mode => {
  const t = text.toLowerCase();
  if (/\b(fire|burn|smoke|flame|blaze|aag)\b/.test(t)) return "fire";
  if (/\b(accident|crash|injur|bleed|hurt|hospital|wound|collision)\b/.test(t)) return "accident";
  if (/\b(unsafe|follow|stalk|danger|attack|harass|help|scared|threat)\b/.test(t)) return "unsafe";
  return null;
};

const Index = () => {
  const [mode, setMode] = useState<Mode>(null);
  const [input, setInput] = useState("");
  const [offline, setOffline] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // Auto-detect from input
  useEffect(() => {
    if (!input.trim()) return;
    const detected = detectMode(input);
    if (detected && detected !== mode) setMode(detected);
  }, [input, mode]);

  const modeClass = useMemo(() => {
    switch (mode) {
      case "fire": return "mode-fire";
      case "accident": return "mode-accident";
      case "unsafe": return "mode-unsafe";
      default: return "mode-default";
    }
  }, [mode]);

  return (
    <DialerProvider>
    <div className={`relative min-h-screen ${modeClass}`}>
      <div className="ambient-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TOP STATS BAR */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <GeoZone />
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/15 border border-success/40 flex items-center justify-center">
              <Shield className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest">PROTOCOL STATUS</div>
              <div className="text-sm font-bold font-mono text-success">{mode ? `${mode.toUpperCase()} ENGAGED` : "ALL CLEAR"}</div>
            </div>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
              <span className="text-primary font-mono text-xs font-bold">12</span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest">MESH NODES</div>
              <div className="text-sm font-bold font-mono text-primary">12 / 12 ONLINE</div>
            </div>
          </div>
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/15 border border-warning/40 flex items-center justify-center">
              <span className="text-warning font-mono text-xs font-bold">⚡</span>
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest">RESPONSE TIME</div>
              <div className="text-sm font-bold font-mono text-warning">~6 min avg</div>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-primary/15 border border-primary/50 flex items-center justify-center" style={{ boxShadow: "var(--glow-cyan)" }}>
              <Shield className="h-6 w-6 text-primary" strokeWidth={2.2} />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success animate-pulse" style={{ boxShadow: "0 0 8px hsl(var(--success))" }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[0.2em] neon-text-cyan leading-none">
                GUARDIAN<span className="text-foreground">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest mt-1">
                CRISIS COMMAND · v2.4.1 · LUCKNOW NODE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block glass rounded-xl px-4 py-3 font-mono text-xs">
              <div className="text-muted-foreground tracking-widest text-[10px]">SYSTEM TIME</div>
              <div className="text-primary text-base">{time.toLocaleTimeString("en-IN", { hour12: false })}</div>
            </div>
            <SystemHealth offline={offline} />
            <button
              onClick={() => setOffline((o) => !o)}
              className={`press-effect glass rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-mono tracking-wider border ${
                offline ? "border-warning text-warning" : "border-border text-muted-foreground hover:text-primary"
              }`}
            >
              {offline ? <WifiOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {offline ? "OFFLINE" : "ONLINE"}
            </button>
          </div>
        </header>

        {/* OFFLINE MODE */}
        {offline && <OfflineGuides />}

        {/* CRISIS CARDS */}
        {!offline && (
          <>
            <section className="grid md:grid-cols-3 gap-5">
              <CrisisCard
                icon={Flame}
                title="FIRE"
                subtitle="Dispatch fire brigade & evacuation routes"
                variant="fire"
                active={mode === "fire"}
                onClick={() => setMode(mode === "fire" ? null : "fire")}
              />
              <CrisisCard
                icon={Car}
                title="ACCIDENT"
                subtitle="Locate trauma centers & ICU availability"
                variant="accident"
                active={mode === "accident"}
                onClick={() => setMode(mode === "accident" ? null : "accident")}
              />
              <CrisisCard
                icon={ShieldAlert}
                title="UNSAFE"
                subtitle="Voice guardian & SOS panic protocol"
                variant="unsafe"
                active={mode === "unsafe"}
                onClick={() => setMode(mode === "unsafe" ? null : "unsafe")}
              />
            </section>

            {/* AI INPUT */}
            <section className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground tracking-widest">
                  AI THREAT CLASSIFIER · DESCRIBE THE SITUATION
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. There's smoke coming from the building... / I see an accident... / Someone is following me..."
                  className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  onClick={() => {
                    const d = detectMode(input);
                    if (d) setMode(d);
                  }}
                  className="press-effect rounded-xl px-5 bg-primary text-primary-foreground font-semibold flex items-center gap-2 text-sm"
                  style={{ boxShadow: "var(--glow-cyan)" }}
                >
                  <Send className="h-4 w-4" /> ANALYZE
                </button>
              </div>
              {mode && (
                <div className="mt-3 text-xs font-mono flex items-center gap-2">
                  <span className="text-muted-foreground">CLASSIFICATION →</span>
                  <span className="px-2 py-0.5 rounded uppercase tracking-widest font-bold" style={{
                    color: "hsl(var(--mode-color))",
                    background: "hsl(var(--mode-color) / 0.1)",
                    border: "1px solid hsl(var(--mode-color) / 0.4)",
                  }}>
                    {mode} PROTOCOL ENGAGED
                  </span>
                </div>
              )}
            </section>

            {/* DYNAMIC PANELS */}
            {mode === "fire" && <FirePanel />}
            {mode === "accident" && <AccidentPanel />}
            {mode === "unsafe" && <UnsafePanel />}

            {!mode && (
              <section className="glass rounded-2xl p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/40 mb-4" style={{ boxShadow: "var(--glow-cyan)" }}>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">All Systems Nominal</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Select a crisis protocol above or describe the situation. GuardianAI is monitoring in real time.
                </p>
              </section>
            )}
          </>
        )}

        {/* HARDWARE CORE */}
        {!offline && <HardwareCore />}

        <footer className="pt-2 pb-4 text-center text-[10px] font-mono text-muted-foreground tracking-widest">
          GUARDIANAI © 2026 · ENCRYPTED CHANNEL · DO NOT MISUSE
        </footer>
      </div>
    </div>
    </DialerProvider>
  );
};

export default Index;
