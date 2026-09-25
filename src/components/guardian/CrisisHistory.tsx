import { useEffect, useState } from "react";
import { Flame, Car, ShieldAlert, History, CheckCircle2, Clock } from "lucide-react";
import { getCrisisEvents, subscribeCrisisEvents, type CrisisRow } from "@/lib/crisisLog";

const iconFor = (t: string) => (t === "FIRE" ? Flame : t === "ACCIDENT" ? Car : ShieldAlert);
const colorFor = (t: string) =>
  t === "FIRE" ? "text-destructive" : t === "ACCIDENT" ? "text-warning" : "text-destructive";

export const CrisisHistory = () => {
  const [rows, setRows] = useState<CrisisRow[]>([]);

  useEffect(() => {
    const load = () => setRows(getCrisisEvents().slice(0, 15));
    load();
    return subscribeCrisisEvents(load);
  }, []);

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono text-muted-foreground tracking-widest">CRISIS LOG · THIS DEVICE</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{rows.length} events</span>
      </div>
      {rows.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground">No crisis events recorded yet.</div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
          {rows.map((r) => {
            const Icon = iconFor(r.type);
            const resolved = !!r.resolved_at;
            return (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-lg bg-secondary/30 border border-border px-3 py-2"
              >
                <Icon className={`h-4 w-4 mt-0.5 ${colorFor(r.type)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`font-bold ${colorFor(r.type)}`}>{r.type}</span>
                    <span className="text-muted-foreground/70">·</span>
                    <span className="text-muted-foreground uppercase">{r.source}</span>
                    {resolved ? (
                      <span className="ml-auto inline-flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-3 w-3" /> RESOLVED
                      </span>
                    ) : (
                      <span className="ml-auto inline-flex items-center gap-1 text-warning">
                        <Clock className="h-3 w-3" /> ACTIVE
                      </span>
                    )}
                  </div>
                  {r.transcript && <div className="text-xs text-foreground/80 mt-0.5 truncate">{r.transcript}</div>}
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {r.location_text} · {new Date(r.created_at).toLocaleString("en-IN", { hour12: false })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
