import { Cpu, Mic, Flame, Activity, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import esp32 from "@/assets/esp32-core.jpg";

export const HardwareCore = () => {
  const [noise, setNoise] = useState(28);
  const [temp, setTemp] = useState(28);
  const [alerts, setAlerts] = useState(5);

  // simulate live readings
  useEffect(() => {
    const i = setInterval(() => {
      setNoise(() => Math.round(20 + Math.random() * 55));
      setTemp(() => +(26 + Math.random() * 6).toFixed(1));
    }, 900);
    return () => clearInterval(i);
  }, []);

  // occasionally bump alerts
  useEffect(() => {
    const i = setInterval(() => {
      if (Math.random() > 0.85) setAlerts((a) => a + 1);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const tempHot = temp > 50;

  return (
    <section
      className="relative rounded-3xl overflow-hidden border border-primary/30"
      style={{ boxShadow: "var(--glow-cyan)" }}
    >
      {/* Background ESP32 image */}
      <div
        className="absolute inset-0 opacity-[0.18] bg-center bg-cover"
        style={{ backgroundImage: `url(${esp32})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_50%_6%/0.85)] via-[hsl(222_50%_5%/0.92)] to-[hsl(222_50%_4%/0.95)]" />
      {/* corner ticks */}
      <span className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
      <span className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-primary/60" />

      <div className="relative p-6 sm:p-8">
        {/* Heading */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/50 flex items-center justify-center"
              style={{ boxShadow: "var(--glow-cyan)" }}
            >
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-[0.3em]">
                HARDWARE CORE
              </div>
              <h3 className="text-2xl font-extrabold tracking-wide neon-text-cyan">
                GuardianAI Hardware <span className="text-foreground/70 font-semibold">(ESP32 Node)</span>
              </h3>
            </div>
          </div>
          <div className="text-xs font-mono text-success flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            MESH OPERATIONAL · 12 NODES
          </div>
        </div>

        {/* 3-column sensor grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Voice Sensor */}
          <div className="rounded-2xl bg-[hsl(222_50%_6%/0.85)] border border-primary/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/40 flex items-center justify-center">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest">SENSOR · 01</div>
                <div className="text-base font-bold">Voice Sensor</div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground mb-1.5 flex items-center justify-between">
              <span>NOISE LEVEL</span>
              <span className="text-primary">{noise} dB</span>
            </div>
            {/* pulsing bar */}
            <div className="h-3 rounded-full bg-secondary/60 overflow-hidden border border-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary-glow to-primary transition-[width] duration-700 ease-out"
                style={{
                  width: `${Math.min(100, noise)}%`,
                  boxShadow: "0 0 12px hsl(var(--primary))",
                }}
              />
            </div>
            {/* mini bars vu meter */}
            <div className="mt-3 flex items-end gap-1 h-8">
              {Array.from({ length: 18 }).map((_, i) => {
                const active = (i / 18) * 100 < noise;
                return (
                  <span
                    key={i}
                    className={`flex-1 rounded-sm transition-all ${active ? "bg-primary" : "bg-primary/15"}`}
                    style={{
                      height: `${20 + ((i * 7) % 80)}%`,
                      boxShadow: active ? "0 0 6px hsl(var(--primary))" : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Fire Sensor */}
          <div
            className={`rounded-2xl border p-5 transition-colors ${
              tempHot
                ? "bg-destructive/10 border-destructive/60"
                : "bg-[hsl(222_50%_6%/0.85)] border-primary/30"
            }`}
            style={tempHot ? { boxShadow: "var(--glow-red)" } : undefined}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  tempHot
                    ? "bg-destructive/20 border-destructive text-destructive"
                    : "bg-warning/15 border-warning/40 text-warning"
                }`}
              >
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest">SENSOR · 02</div>
                <div className="text-base font-bold">Fire Sensor</div>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div className={`text-5xl font-extrabold font-mono ${tempHot ? "neon-text-red" : "text-foreground"}`}>
                {temp}°
              </div>
              <div className="text-sm font-mono text-muted-foreground pb-2">C</div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-mono">
              <span
                className={`h-2 w-2 rounded-full ${tempHot ? "bg-destructive animate-pulse" : "bg-success"}`}
              />
              <span className={tempHot ? "text-destructive" : "text-success"}>
                {tempHot ? "DANGER · FIRE RISK" : "Normal · safe range"}
              </span>
            </div>
            <div className="mt-3 text-[10px] font-mono text-muted-foreground">
              Threshold: <span className="text-warning">50°C</span>
            </div>
          </div>

          {/* Crisis Tracker */}
          <div className="rounded-2xl bg-[hsl(222_50%_6%/0.85)] border border-warning/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-warning/15 border border-warning/40 text-warning flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest">TRACKER · 03</div>
                <div className="text-base font-bold">Crisis Tracker</div>
              </div>
            </div>
            <div className="text-center py-2">
              <div className="text-5xl font-extrabold font-mono text-warning" style={{ textShadow: "0 0 18px hsl(var(--warning) / 0.6)" }}>
                {alerts}
              </div>
              <div className="text-xs font-mono text-muted-foreground tracking-widest mt-1">
                TOTAL ALERTS DETECTED
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="rounded-md bg-secondary/40 border border-border py-1.5">
                <div className="text-destructive font-bold">{Math.max(0, alerts - 3)}</div>
                <div className="text-muted-foreground">FIRE</div>
              </div>
              <div className="rounded-md bg-secondary/40 border border-border py-1.5">
                <div className="text-warning font-bold">2</div>
                <div className="text-muted-foreground">CRASH</div>
              </div>
              <div className="rounded-md bg-secondary/40 border border-border py-1.5">
                <div className="text-primary font-bold">1</div>
                <div className="text-muted-foreground">SOS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer status strip */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/40 border border-border px-4 py-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-success">
            <Activity className="h-3.5 w-3.5" />
            ESP32-WROOM · v2.1 · UPTIME 99.8%
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>LATENCY <span className="text-primary">8ms</span></span>
            <span>NODES <span className="text-primary">12 / 12</span></span>
            <span>GSM <span className="text-warning">STANDBY</span></span>
          </div>
        </div>
      </div>
    </section>
  );
};
