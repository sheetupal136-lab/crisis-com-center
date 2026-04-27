import { Phone, X, Delete } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface DialerProps {
  number: string;
  onClose: () => void;
  onChange: (n: string) => void;
}

export const Dialer = ({ number, onClose, onChange }: DialerProps) => {
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    setCalling(false);
  }, [number]);

  const press = (k: string) => onChange((number + k).slice(0, 15));
  const back = () => onChange(number.slice(0, -1));

  const call = () => {
    if (!number) return;
    setCalling(true);
    toast.error(`📞 Dialing ${number}`, { description: "tel: API engaged · routing via secure channel" });
    setTimeout(() => {
      window.location.href = `tel:${number}`;
    }, 600);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass-strong rounded-3xl p-6 w-full max-w-xs border-2 border-primary" style={{ boxShadow: "var(--glow-cyan)" }}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary press-effect">
          <X className="h-4 w-4" />
        </button>
        <div className="text-center mb-4">
          <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-2">SECURE DIALER</div>
          <div className="h-14 flex items-center justify-center">
            <span className="font-mono text-3xl neon-text-cyan tracking-widest">
              {number || <span className="text-muted-foreground/40 text-lg">enter number</span>}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="press-effect h-14 rounded-xl bg-secondary/60 border border-border hover:border-primary hover:bg-primary/10 text-xl font-semibold font-mono"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={call}
            disabled={!number || calling}
            className="press-effect flex-1 h-14 rounded-xl bg-success text-success-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ boxShadow: "var(--glow-success)" }}
          >
            <Phone className={`h-5 w-5 ${calling ? "animate-bounce" : ""}`} />
            {calling ? "CONNECTING" : "CALL"}
          </button>
          <button onClick={back} className="press-effect h-14 w-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
