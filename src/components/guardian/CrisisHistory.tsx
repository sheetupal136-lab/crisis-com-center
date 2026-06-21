import { useEffect, useState } from "react";
import { Flame, Car, ShieldAlert, History, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CrisisRow {
  id: string;
  type: "FIRE" | "ACCIDENT" | "UNSAFE";
  source: string;
  transcript: string | null;
  location_text: string | null;
  resolved_at: string | null;
  created_at: string;
}

const iconFor = (t: string) => (t === "FIRE" ? Flame : t === "ACCIDENT" ? Car : ShieldAlert);
const colorFor = (t: string) =>
  t === "FIRE" ? "text-destructive" : t === "ACCIDENT" ? "text-warning" : "text-destructive";

export const CrisisHistory = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<CrisisRow[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("crisis_events")
        .select("id, type, source, transcript, location_text, resolved_at, created_at")
        .order("created_at", { ascending: false })
        .limit(15);
      setRows((data ?? []) as CrisisRow[]);
    };
    load();
    const channel = supabase
      .channel("crisis-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "crisis_events" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-primary" />
        <span className="text-xs font-mono text-muted-foreground tracking-widest">CRISIS LOG · LIVE</span>
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
