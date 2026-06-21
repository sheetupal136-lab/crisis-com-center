import { useEffect, useState } from "react";
import { Mic, Thermometer, Activity, Radio, Cpu, Signal, Bluetooth } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SensorRow {
  temperature_c: number | null;
  decibel: number | null;
  accel_x: number | null;
  accel_y: number | null;
  accel_z: number | null;
}

export const HardwareArchitecture = () => {
  const [live, setLive] = useState<SensorRow | null>(null);
  // simulated fallbacks that drift over time
  const [simNoise, setSimNoise] = useState(34);
  const [simTemp, setSimTemp] = useState(27.4);
  const [simAxis, setSimAxis] = useState({ x: 0.02, y: -0.01, z: 0.99 });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("sensor_readings")
        .select("temperature_c, decibel, accel_x, accel_y, accel_z")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setLive(data as SensorRow);
    };
    load();
    const channel = supabase
      .channel("sensor-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "sensor_readings" }, (p) => {
        setLive(p.new as SensorRow);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setSimNoise(20 + Math.random() * 50);
      setSimTemp(+(26 + Math.random() * 3).toFixed(1));
      setSimAxis({
        x: +(Math.random() * 0.08 - 0.04).toFixed(2),
        y: +(Math.random() * 0.08 - 0.04).toFixed(2),
        z: +(0.97 + Math.random() * 0.04).toFixed(2),
      });
    }, 1100);
    return () => clearInterval(i);
  }, []);

  const noise = live?.decibel ?? simNoise;
  const temp = live?.temperature_c ?? simTemp;
  const ax = live?.accel_x ?? simAxis.x;
  const ay = live?.accel_y ?? simAxis.y;
  const az = live?.accel_z ?? simAxis.z;
  const tempHot = temp > 60;
  const tempStatus = tempHot ? "DANGER" : "SAFE";
  const dataSource = live ? "ESP32 LIVE" : "SIMULATED";

  return (
    <section className="rounded-3xl border border-primary/30 bg-[hsl(222_50%_5%/0.6)] p-6 sm:p-8" style={{ boxShadow: "var(--glow-cyan)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/50 flex items-center justify-center" style={{ boxShadow: "var(--glow-cyan)" }}>
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-muted-foreground tracking-[0.3em]">SCHEMATIC · DEEP DIVE</div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-wide neon-text-cyan">
              INTERNAL HARDWARE ARCHITECTURE <span className="text-foreground/70 font-semibold">(ESP32-NODE)</span>
            </h3>
          </div>
        </div>
        <div className={`text-xs font-mono flex items-center gap-2 px-3 py-1.5 rounded-full border ${live ? "text-success bg-success/10 border-success/30" : "text-muted-foreground bg-secondary/40 border-border"}`}>
          <span className={`h-2 w-2 rounded-full ${live ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
          {dataSource}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* CARD 1 — Acoustic */}
        <HwCard icon={Mic} title="Acoustic Surveillance" subtitle="MEMS Microphone · INMP441"
          feature="High-Frequency Distress Detection"
          detail="Monitors 50Hz–20kHz range for 'HELP' keywords and screaming patterns."
          accent="primary">
          <div className="flex items-end gap-1 h-14 mt-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const seed = Math.sin((Date.now() / 200 + i) * 0.7) * 0.5 + 0.5;
              const h = 20 + seed * Math.min(80, noise);
              return (
                <span key={i} className="flex-1 rounded-sm bg-primary transition-all"
                  style={{ height: `${h}%`, boxShadow: "0 0 6px hsl(var(--primary) / 0.7)", opacity: 0.4 + (h / 100) * 0.6 }} />
              );
            })}
          </div>
          <Row label="SIGNAL LEVEL" value={`${noise.toFixed(0)} dB`} color="text-primary" />
        </HwCard>

        {/* CARD 2 — Thermal */}
        <HwCard icon={Thermometer} title="Thermal Matrix" subtitle="DHT22 / Thermistor"
          feature="Fire & Heat Mapping"
          detail="Detects rapid temp spikes (>60°C) and smoke density via NTC array."
          accent={tempHot ? "destructive" : "warning"}>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative w-3 h-20 rounded-full bg-secondary/60 border border-border overflow-hidden">
              <div className={`absolute bottom-0 left-0 right-0 rounded-full transition-all ${tempHot ? "bg-destructive" : "bg-warning"}`}
                style={{ height: `${Math.min(100, (temp / 80) * 100)}%`, boxShadow: tempHot ? "0 0 10px hsl(var(--destructive))" : "0 0 10px hsl(var(--warning))" }} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-warning border border-background" />
            </div>
            <div>
              <div className={`text-3xl font-extrabold font-mono ${tempHot ? "neon-text-red" : "text-foreground"}`}>{temp.toFixed(1)}°C</div>
              <div className={`text-[10px] font-mono mt-1 ${tempHot ? "text-destructive" : "text-success"}`}>
                Current · Status: <span className="font-bold">{tempStatus}</span>
              </div>
            </div>
          </div>
          <Row label="THRESHOLD" value="60°C" color="text-warning" />
        </HwCard>

        {/* CARD 3 — Kinetic */}
        <HwCard icon={Activity} title="Kinetic Impact Sensor" subtitle="MPU6050 · 6-Axis IMU"
          feature="Accident & Fall Detection"
          detail="3-Axis gyroscope + accelerometer detects high-G impacts and sudden deceleration."
          accent="success">
          <div className="mt-2 space-y-1.5">
            {(["X", "Y", "Z"] as const).map((axis, idx) => {
              const val = [ax, ay, az][idx];
              const pct = Math.min(100, Math.abs(val) * 100);
              return (
                <div key={axis} className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="w-3 text-success">{axis}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary/60 border border-border overflow-hidden">
                    <div className="h-full rounded-full bg-success transition-all"
                      style={{ width: `${Math.max(8, pct)}%`, boxShadow: "0 0 6px hsl(var(--success))" }} />
                  </div>
                  <span className="text-success w-12 text-right">{val.toFixed(2)}g</span>
                </div>
              );
            })}
          </div>
          <Row label="IMPACT TRIGGER" value=">4.0g" color="text-success" />
        </HwCard>

        {/* CARD 4 — Comm */}
        <HwCard icon={Radio} title="Redundant Comm Hub" subtitle="SIM800L · ESP32 BLE Mesh"
          feature="Zero-Network Resilience"
          detail="SIM800L SMS fallback + Bluetooth Mesh peer-to-peer when Wi-Fi fails."
          accent="primary">
          <div className="mt-2 space-y-2">
            <SignalRow icon={Signal} label="GSM Active" bars={4} color="success" />
            <SignalRow icon={Bluetooth} label="BLE Synced" bars={5} color="primary" />
          </div>
          <Row label="MESH PEERS" value="12 / 12" color="text-primary" />
        </HwCard>
      </div>
    </section>
  );
};

const HwCard = ({
  icon: Icon, title, subtitle, feature, detail, accent, children,
}: {
  icon: any; title: string; subtitle: string; feature: string; detail: string;
  accent: "primary" | "destructive" | "warning" | "success";
  children?: React.ReactNode;
}) => {
  const accentMap: Record<string, string> = {
    primary: "border-primary/40",
    destructive: "border-destructive/50",
    warning: "border-warning/40",
    success: "border-success/40",
  };
  const glowMap: Record<string, string> = {
    primary: "var(--glow-cyan)",
    destructive: "var(--glow-red)",
    warning: "var(--glow-warning)",
    success: "var(--glow-success)",
  };
  return (
    <div className={`relative rounded-2xl bg-[hsl(222_50%_6%/0.92)] border ${accentMap[accent]} p-4 transition-all hover:-translate-y-0.5`}
      style={{ boxShadow: glowMap[accent] }}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border bg-${accent}/15 border-${accent}/40 text-${accent}`}
          style={{ background: `hsl(var(--${accent}) / 0.15)`, borderColor: `hsl(var(--${accent}) / 0.45)`, color: `hsl(var(--${accent}))` }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight">{title}</div>
          <div className="text-[10px] font-mono text-muted-foreground tracking-widest">{subtitle}</div>
        </div>
      </div>
      <div className="text-xs font-semibold text-foreground mb-1">{feature}</div>
      <div className="text-[11px] text-muted-foreground leading-snug mb-2">{detail}</div>
      {children}
    </div>
  );
};

const Row = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono">
    <span className="text-muted-foreground tracking-widest">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const SignalRow = ({ icon: Icon, label, bars, color }: { icon: any; label: string; bars: number; color: string }) => (
  <div className="flex items-center gap-2 text-[11px] font-mono">
    <Icon className="h-3.5 w-3.5" style={{ color: `hsl(var(--${color}))` }} />
    <span className="flex-1 text-foreground/80">{label}</span>
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4, 5].map((b) => (
        <span key={b} className="w-1 rounded-sm transition-all"
          style={{
            height: `${b * 18}%`,
            background: b <= bars ? `hsl(var(--${color}))` : "hsl(var(--muted))",
            boxShadow: b <= bars ? `0 0 4px hsl(var(--${color}))` : undefined,
          }} />
      ))}
    </div>
  </div>
);
