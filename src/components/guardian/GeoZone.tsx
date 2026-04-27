import { MapPin, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export const GeoZone = () => {
  const [zone, setZone] = useState("Hardoi Node");
  const [warning, setWarning] = useState(false);
  const [coords, setCoords] = useState("27.39° N · 80.13° E");

  useEffect(() => {
    // Simulate occasional geofence drift
    const i = setInterval(() => {
      const drift = Math.random();
      if (drift > 0.85) {
        setWarning(true);
        setZone("Boundary Drift");
        setCoords(`27.${(Math.random() * 99).toFixed(0)}° N · 80.${(Math.random() * 99).toFixed(0)}° E`);
        setTimeout(() => {
          setWarning(false);
          setZone("Hardoi Node");
          setCoords("27.39° N · 80.13° E");
        }, 3500);
      }
    }, 7000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className={`glass rounded-xl px-4 py-3 flex items-center gap-3 border transition-colors ${
        warning ? "border-warning animate-pulse" : "border-border"
      }`}
      style={{ boxShadow: warning ? "var(--glow-warning)" : undefined }}
    >
      <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${warning ? "bg-warning/15" : "bg-primary/15"}`}>
        {warning ? <AlertTriangle className="h-4 w-4 text-warning" /> : <MapPin className="h-4 w-4 text-primary" />}
        <span className={`absolute inset-0 rounded-lg ${warning ? "animate-ping bg-warning/30" : ""}`} />
      </div>
      <div>
        <div className="text-[10px] font-mono text-muted-foreground tracking-widest">GEO-FENCE ZONE</div>
        <div className={`text-sm font-bold font-mono ${warning ? "text-warning" : "text-primary"}`}>
          {warning ? "⚠ DRIFT DETECTED" : `ZONE: ${zone} Active`}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground/70">{coords}</div>
      </div>
    </div>
  );
};
