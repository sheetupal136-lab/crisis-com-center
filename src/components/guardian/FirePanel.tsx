import { Flame, Phone, MapPin, Navigation, Terminal, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDialer } from "@/contexts/DialerContext";

interface LogEntry {
  ts: string;
  text: string;
  ok?: boolean;
}

export const FirePanel = () => {
  const [calling, setCalling] = useState(false);
  const [connected, setConnected] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const dialer = useDialer();

  const pushLog = (text: string, ok = true) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setLog((l) => [{ ts, text, ok }, ...l].slice(0, 8));
  };

  // Auto-log on activation
  useEffect(() => {
    pushLog("FIRE PROTOCOL engaged · awaiting dispatch", true);
    // eslint-disable-next-line
  }, []);

  const handleCall = () => {
    setCalling(true);
    setConnected(false);
    toast.error("🚨 Fire Brigade Dispatched", { description: "Hazratganj Station — ETA 6 min" });
    pushLog("101 Dispatched via tel: API");
    setTimeout(() => pushLog("Hardoi Fire Chief Notified"), 700);
    setTimeout(() => pushLog("Hazratganj Unit en route — ETA 6 min"), 1400);
    setTimeout(() => {
      setCalling(false);
      setConnected(true);
      dialer.open("101");
    }, 2200);
  };

  const stations = [
    { name: "Hazratganj Fire Station", dist: "1.2 km", eta: "6 min", x: 48, y: 42 },
    { name: "Gomti Nagar Station", dist: "3.8 km", eta: "11 min", x: 70, y: 58 },
    { name: "Aliganj Station", dist: "5.1 km", eta: "14 min", x: 32, y: 30 },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* Map */}
      <div className="lg:col-span-3 glass rounded-2xl p-5 relative overflow-hidden min-h-[420px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono text-muted-foreground tracking-widest">LIVE TACTICAL MAP</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-destructive" /> Lucknow, UP
            </h3>
          </div>
          <div className="text-xs font-mono text-destructive flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            FIRE PROTOCOL ACTIVE
          </div>
        </div>

        <div className="relative h-[330px] rounded-xl overflow-hidden border border-border bg-[hsl(222_50%_6%)]">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(hsl(187 100% 50% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(187 100% 50% / 0.08) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 200 Q 200 150 400 220 T 800 180" stroke="hsl(187 100% 50% / 0.3)" strokeWidth="2" fill="none" />
            <path d="M 100 0 Q 150 200 250 400" stroke="hsl(187 100% 50% / 0.25)" strokeWidth="2" fill="none" />
            <path d="M 600 0 L 550 400" stroke="hsl(187 100% 50% / 0.25)" strokeWidth="2" fill="none" />
            <path d="M 0 80 L 800 100" stroke="hsl(187 100% 50% / 0.2)" strokeWidth="1" fill="none" />
          </svg>

          <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full border border-destructive/40" />
              <div className="absolute inset-4 rounded-full border border-destructive/30" />
              <div className="absolute inset-10 rounded-full border border-destructive/20" />
              <div className="absolute inset-0 rounded-full origin-center animate-radar" style={{
                background: "conic-gradient(from 0deg, transparent 0deg, hsl(0 95% 55% / 0.4) 60deg, transparent 90deg)"
              }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <Flame className="h-8 w-8 text-destructive drop-shadow-[0_0_8px_hsl(0_95%_55%)]" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {stations.map((s, i) => (
            <div key={i} className="absolute group" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-primary animate-blip" style={{ boxShadow: "0 0 12px hsl(var(--primary))" }} />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono text-primary opacity-70">
                  {s.name.split(" ")[0]}
                </div>
              </div>
            </div>
          ))}

          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

          <div className="absolute bottom-2 left-2 font-mono text-[10px] text-primary/60">
            26.8467° N, 80.9462° E
          </div>
          <div className="absolute bottom-2 right-2 font-mono text-[10px] text-primary/60">
            ZOOM 14 · LIVE
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-2">EMERGENCY DISPATCH</div>
          <button
            onClick={handleCall}
            disabled={calling}
            className={`press-effect w-full rounded-xl py-5 px-4 font-bold text-lg tracking-wider relative overflow-hidden border-2 ${
              calling
                ? "border-destructive bg-destructive/20 text-destructive animate-pulse-ring"
                : "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }`}
            style={{ boxShadow: "var(--glow-red)" }}
          >
            <span className="flex items-center justify-center gap-3">
              <Phone className={`h-5 w-5 ${calling ? "animate-bounce" : ""}`} />
              {calling ? "CONNECTING..." : connected ? "✓ DISPATCHED · CALL AGAIN" : "CALL FIRE BRIGADE"}
            </span>
          </button>

          {calling && (
            <div className="mt-4 text-center text-sm font-mono text-destructive animate-flicker">
              Connecting to Nearest Station...
            </div>
          )}
          {connected && !calling && (
            <div className="mt-4 text-center text-sm font-mono text-success">
              ✓ Hazratganj Unit en route — ETA 6 min
            </div>
          )}
        </div>

        {/* DISPATCH LOG */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest">DISPATCH LOG</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
          </div>
          <div className="rounded-lg bg-[hsl(222_50%_5%)] border border-destructive/20 p-3 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
            {log.length === 0 ? (
              <div className="text-muted-foreground italic">awaiting events...</div>
            ) : (
              log.map((l, i) => (
                <div key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2">
                  <span className="text-muted-foreground/60 shrink-0">[{l.ts}]</span>
                  <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground/90 break-words">{l.text}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-3">NEAREST UNITS</div>
          <ul className="space-y-3">
            {stations.map((s, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/60">
                <div className="flex items-center gap-3">
                  <Navigation className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{s.dist} away</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-primary">{s.eta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
