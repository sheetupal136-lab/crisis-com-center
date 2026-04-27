import { Hospital, BedDouble, Phone, Ambulance, Clock, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { useDialer } from "@/contexts/DialerContext";

const hospitals = [
  { name: "Apollo Hospitals", dist: "2.4 km", eta: "8 min", icu: 3, trauma: true, rating: 4.8 },
  { name: "Medanta - The Medicity", dist: "4.1 km", eta: "12 min", icu: 5, trauma: true, rating: 4.7 },
  { name: "SGPGI Lucknow", dist: "6.7 km", eta: "16 min", icu: 2, trauma: true, rating: 4.9 },
  { name: "Sahara Hospital", dist: "3.3 km", eta: "10 min", icu: 4, trauma: false, rating: 4.5 },
];

export const AccidentPanel = () => {
  const dialer = useDialer();
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-mono text-muted-foreground tracking-widest">MEDICAL DISPATCH</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Hospital className="h-5 w-5 text-warning" /> Nearby Hospitals
            </h3>
          </div>
          <button
            onClick={() => {
              toast.error("📞 Notifying 108 Ambulance Service", { description: "tel: API · auto-routing to nearest unit" });
              dialer.open("108");
            }}
            className="press-effect rounded-lg px-3 py-2 bg-warning text-warning-foreground font-bold text-xs flex items-center gap-1.5 tracking-wider"
            style={{ boxShadow: "var(--glow-warning)" }}
          >
            <PhoneCall className="h-3.5 w-3.5" /> NOTIFY 108
          </button>
        </div>

        <ul className="space-y-3">
          {hospitals.map((h, i) => (
            <li key={i} className="glass rounded-xl p-4 hover:border-warning/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{h.name}</h4>
                    {h.trauma && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">
                        Level-1 Trauma
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Ambulance className="h-3 w-3" /> {h.dist}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {h.eta}</span>
                    <span>★ {h.rating}</span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/15 border border-success/40">
                    <BedDouble className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-mono text-success font-semibold">
                      {h.icu} Emergency ICU Beds Available
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`Notifying ${h.name}`, { description: "ER team prepped — ambulance dispatched" })}
                  className="press-effect rounded-lg px-3 py-2 bg-warning text-warning-foreground font-semibold text-sm flex items-center gap-1.5"
                  style={{ boxShadow: "var(--glow-warning)" }}
                >
                  <Phone className="h-4 w-4" /> Alert
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => toast.error("🚑 Ambulance Dispatched", { description: "Apollo unit — ETA 8 min · Driver: Rajesh K." })}
          className="press-effect w-full glass rounded-2xl p-6 border-2 border-warning hover:bg-warning/10 transition-colors"
          style={{ boxShadow: "var(--glow-warning)" }}
        >
          <Ambulance className="h-10 w-10 text-warning mx-auto mb-3" />
          <div className="font-bold text-lg tracking-wider">DISPATCH AMBULANCE</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">Auto-routed to nearest ER</div>
        </button>

        <div className="glass rounded-2xl p-5">
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-3">VITAL CHECKLIST</div>
          <ul className="space-y-2 text-sm">
            {["Check responsiveness", "Clear airway", "Control bleeding", "Do not move neck/spine", "Stay on the line"].map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
