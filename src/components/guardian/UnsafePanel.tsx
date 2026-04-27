import { Mic, MicOff, ShieldAlert, MessageSquare, Phone, X, Terminal, CheckCircle2, PhoneCall } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDialer } from "@/contexts/DialerContext";

interface LogEntry { ts: string; text: string }

export const UnsafePanel = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sosActive, setSosActive] = useState(false);
  const [supported, setSupported] = useState(true);
  const [log, setLog] = useState<LogEntry[]>([]);
  const recognitionRef = useRef<any>(null);
  const dialer = useDialer();

  const pushLog = (text: string) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setLog((l) => [{ ts, text }, ...l].slice(0, 8));
  };

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
      if (/help\s*help|help\s+me|sos|bachao/i.test(text)) {
        triggerSOS();
      }
    };
    rec.onend = () => {
      if (listening) {
        try { rec.start(); } catch {}
      }
    };
    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
    // eslint-disable-next-line
  }, []);

  const toggleListen = () => {
    if (!supported) {
      toast.error("Voice not supported", { description: "Use Chrome/Edge for Web Speech API" });
      return;
    }
    const rec = recognitionRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
        setTranscript("");
        toast.info("👂 Listening for distress keywords...", { description: 'Say "Help Help" to trigger SOS' });
      } catch {}
    }
  };

  const triggerSOS = () => {
    if (sosActive) return;
    setSosActive(true);
    toast.error("🚨 SOS ACTIVATED", { description: "Alerting emergency contacts via SMS..." });
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
    pushLog("Sending SOS to 112 (Police)");
    setTimeout(() => pushLog("Parent Notified via SMS API"), 600);
    setTimeout(() => pushLog("Live GPS pin shared with guardians"), 1200);
    setTimeout(() => pushLog("Audio recording started · uploading to vault"), 1800);
  };

  const autoDialParents = () => {
    toast.info("📞 Auto-dialing primary guardian", { description: "Mom · +91 98XXX XX012" });
    pushLog("Auto-Dial Parents engaged");
    dialer.open("9876543210");
  };

  const dismissSOS = () => {
    setSosActive(false);
    toast.success("SOS dismissed", { description: "False alarm logged" });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* Voice Module */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-mono text-muted-foreground tracking-widest">VOICE GUARDIAN</div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Distress Detection
            </h3>
          </div>
          <div className={`text-xs font-mono flex items-center gap-2 ${listening ? "text-destructive" : "text-muted-foreground"}`}>
            <span className={`h-2 w-2 rounded-full ${listening ? "bg-destructive animate-pulse" : "bg-muted-foreground"}`} />
            {listening ? "ACTIVE" : "STANDBY"}
          </div>
        </div>

        <div className="flex flex-col items-center py-6">
          <button
            onClick={toggleListen}
            className={`relative press-effect w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all ${
              listening
                ? "border-destructive bg-destructive/20 text-destructive"
                : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
            }`}
            style={{ boxShadow: listening ? "var(--glow-red)" : "var(--glow-cyan)" }}
          >
            {listening ? <Mic className="h-12 w-12" /> : <MicOff className="h-12 w-12" />}
            {listening && (
              <>
                <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                <span className="absolute -inset-2 rounded-full border border-destructive/40 animate-ping" />
              </>
            )}
          </button>
          <div className="mt-4 text-sm font-mono text-muted-foreground text-center">
            {listening ? 'Say "Help Help" to trigger SOS' : "Tap mic to start guardian"}
          </div>
        </div>

        <div className="rounded-xl bg-secondary/40 border border-border p-3 min-h-[80px]">
          <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-1 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> LIVE TRANSCRIPT
          </div>
          <div className="text-sm font-mono text-foreground/80 break-words">
            {transcript || <span className="text-muted-foreground italic">Awaiting input...</span>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <button
          onClick={triggerSOS}
          className="press-effect w-full glass rounded-2xl p-6 border-2 border-destructive hover:bg-destructive/10"
          style={{ boxShadow: "var(--glow-red)" }}
        >
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
          <div className="font-bold text-xl tracking-wider neon-text-red">TRIGGER SOS</div>
          <div className="text-xs text-muted-foreground mt-1 font-mono">Manual emergency activation</div>
        </button>

        <button
          onClick={autoDialParents}
          className="press-effect w-full glass rounded-2xl p-4 border-2 border-primary hover:bg-primary/10 flex items-center justify-center gap-2 font-bold tracking-wider"
          style={{ boxShadow: "var(--glow-cyan)" }}
        >
          <PhoneCall className="h-5 w-5 text-primary" />
          <span className="neon-text-cyan">AUTO-DIAL PARENTS</span>
        </button>

        {/* STATUS LOG */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-mono text-muted-foreground tracking-widest">STATUS LOG</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
          </div>
          <div className="rounded-lg bg-[hsl(222_50%_5%)] border border-destructive/20 p-3 font-mono text-xs space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
            {log.length === 0 ? (
              <div className="text-muted-foreground italic">trigger SOS to view log...</div>
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
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-3">EMERGENCY CONTACTS</div>
          <ul className="space-y-2">
            {[
              { name: "Mom", num: "+91 98XXX XX012", dial: "9876543210" },
              { name: "Dad", num: "+91 98XXX XX034", dial: "9876543411" },
              { name: "Local Guardian", num: "+91 95XXX XX678", dial: "9512345678" },
            ].map((c, i) => (
              <li
                key={i}
                onClick={() => dialer.open(c.dial)}
                className="press-effect cursor-pointer flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/60 hover:border-primary/60 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs font-mono text-muted-foreground">{c.num}</div>
                </div>
                <Phone className="h-4 w-4 text-primary" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SOS Overlay */}
      {sosActive && (
        <div className="fixed inset-0 z-[100] animate-sos-flash flex items-center justify-center p-6">
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative max-w-lg w-full glass-strong rounded-3xl p-8 border-4 border-destructive text-center" style={{ boxShadow: "var(--glow-red)" }}>
            <button onClick={dismissSOS} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary press-effect">
              <X className="h-5 w-5" />
            </button>
            <ShieldAlert className="h-20 w-20 text-destructive mx-auto mb-4 animate-pulse" />
            <h2 className="text-5xl font-black neon-text-red tracking-widest mb-2">SOS</h2>
            <p className="text-lg font-bold mb-1">DISTRESS SIGNAL ACTIVE</p>
            <p className="text-sm text-muted-foreground font-mono mb-6">
              📍 Location shared · 📡 Recording audio
            </p>

            <div className="space-y-2 mb-6 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/40">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-mono">✓ Alerting Parents via SMS</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/40">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-mono">✓ Live location pinned</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/40">
                <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                <span className="text-sm font-mono">⏳ Standing by for police dispatch</span>
              </div>
            </div>

            <a
              href="tel:112"
              className="press-effect block w-full rounded-xl py-5 bg-destructive text-destructive-foreground font-bold text-xl tracking-wider"
              style={{ boxShadow: "0 0 40px hsl(0 95% 55% / 0.8)" }}
            >
              <Phone className="inline h-6 w-6 mr-2" />
              CALL 112 POLICE
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
