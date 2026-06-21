import { Mic, MicOff, ShieldAlert, MessageSquare, X, Phone, MapPin, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { setStatus } from "@/lib/firebase";
import { logCrisisEvent } from "@/lib/crisisLog";

interface Props {
  onTriggerUnsafe: () => void;
}

const TRIGGER_REGEX = /\b(help|stop|bachao|sos|save\s*me)\b/i;
const LOCATION = "Hardoi Road, Lucknow (26.8467° N, 80.9462° E)";

export const VoiceGuardian = ({ onTriggerUnsafe }: Props) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [sosNotice, setSosNotice] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const recRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmStopRef = useRef<(() => void) | null>(null);

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
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text.trim());
      if (TRIGGER_REGEX.test(text)) {
        triggerSOS();
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        toast.error("Microphone blocked", { description: "Allow mic access to use Voice Guardian" });
        setListening(false);
      }
    };
    rec.onend = () => {
      // auto-restart while listening flag is true
      try {
        if (recRef.current?._shouldListen) rec.start();
      } catch {}
    };
    recRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
      stopAlarm();
    };
    // eslint-disable-next-line
  }, []);

  const playAlarm = () => {
    try {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
      const start = ctx.currentTime;
      // siren sweep
      for (let i = 0; i < 6; i++) {
        osc.frequency.setValueAtTime(880, start + i * 0.6);
        osc.frequency.exponentialRampToValueAtTime(1760, start + i * 0.6 + 0.3);
        osc.frequency.exponentialRampToValueAtTime(880, start + i * 0.6 + 0.6);
      }
      osc.start();
      const stop = () => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
          osc.stop(ctx.currentTime + 0.15);
        } catch {}
      };
      alarmStopRef.current = stop;
      setTimeout(stop, 3600);
    } catch (e) {
      console.warn("Alarm failed:", e);
    }
  };

  const stopAlarm = () => {
    try { alarmStopRef.current?.(); } catch {}
    alarmStopRef.current = null;
  };

  const toggleListen = () => {
    if (!supported) {
      toast.error("Voice not supported", { description: "Use Chrome / Edge for Web Speech API" });
      return;
    }
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      rec._shouldListen = false;
      try { rec.stop(); } catch {}
      setListening(false);
      toast.info("Voice Guardian stopped");
    } else {
      rec._shouldListen = true;
      try {
        rec.start();
        setListening(true);
        setTranscript("");
        toast.success("👂 Voice Guardian LISTENING…", { description: 'Say "Help" or "Stop" to trigger SOS' });
      } catch {}
    }
  };

  const triggerSOS = () => {
    if (sosNotice) return;
    setSosNotice(true);
    setSmsOpen(true);
    onTriggerUnsafe();
    setStatus("UNSAFE").catch(() => {});
    logCrisisEvent({
      type: "UNSAFE",
      source: "voice",
      transcript: transcript || "Voice trigger: HELP detected",
      location_text: LOCATION,
      latitude: 26.8467,
      longitude: 80.9462,
    }).catch(() => {});
    if ("vibrate" in navigator) navigator.vibrate([400, 120, 400, 120, 600]);
    playAlarm();
    toast.error("🚨 SOS DISPATCHED", { description: "Parent SMS sent · Police (112) dialing…" });
    setTimeout(() => setSosNotice(false), 6000);
  };

  return (
    <>
      {/* Prominent Voice Guardian Card */}
      <section
        className="glass rounded-2xl p-5 sm:p-6 border-2 relative overflow-hidden"
        style={{
          borderColor: listening ? "hsl(var(--destructive))" : "hsl(var(--primary) / 0.5)",
          boxShadow: listening ? "var(--glow-red)" : "var(--glow-cyan)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Big Mic Button */}
          <button
            onClick={toggleListen}
            aria-label={listening ? "Stop Voice Guardian" : "Start Voice Guardian"}
            className={`press-effect relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
              listening
                ? "border-destructive bg-destructive/20 text-destructive"
                : "border-primary bg-primary/15 text-primary hover:bg-primary/25"
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

          {/* Status */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-[11px] font-mono text-muted-foreground tracking-[0.25em] mb-1">
              VOICE GUARDIAN
            </div>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-wide ${listening ? "neon-text-red" : "neon-text-cyan"}`}>
              {listening ? "LISTENING…" : "TAP MIC TO ARM"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Say <span className="text-destructive font-semibold">“Help”</span> or{" "}
              <span className="text-destructive font-semibold">“Stop”</span> to trigger an instant SOS — alerts parents &amp; police automatically.
            </p>
            <div className="mt-3 rounded-lg bg-secondary/40 border border-border px-3 py-2 text-xs font-mono min-h-[40px] flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate text-foreground/80">
                {transcript || <span className="text-muted-foreground/70 italic">Awaiting voice input…</span>}
              </span>
            </div>
          </div>

          {/* Manual SOS */}
          <button
            onClick={triggerSOS}
            className="press-effect rounded-xl px-5 py-4 bg-destructive text-destructive-foreground font-bold tracking-wider flex items-center gap-2 shrink-0"
            style={{ boxShadow: "var(--glow-red)" }}
          >
            <ShieldAlert className="h-5 w-5" />
            PANIC SOS
          </button>
        </div>
      </section>

      {/* FULL-SCREEN RED FLASH */}
      {sosNotice && (
        <div className="fixed inset-0 z-[100] pointer-events-none animate-sos-flash" style={{ mixBlendMode: "screen" }} />
      )}

      {/* Big SOS Notification */}
      {sosNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] w-[min(620px,94vw)] animate-in fade-in slide-in-from-top-4">
          <div
            className="glass-strong rounded-2xl border-2 border-destructive p-5 flex items-center gap-4"
            style={{ boxShadow: "0 0 60px hsl(0 95% 55% / 0.8)" }}
          >
            <div className="w-14 h-14 rounded-xl bg-destructive/20 border border-destructive flex items-center justify-center animate-pulse">
              <ShieldAlert className="h-7 w-7 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono tracking-widest text-destructive">SOS TRANSMITTED · 112 PROTOCOL</div>
              <div className="text-lg font-bold neon-text-red leading-tight">SOS DISPATCHED!</div>
              <div className="text-xs font-mono text-foreground/80 mt-1">
                ✓ Parent SMS Sent &nbsp;·&nbsp; ☎ Police (112) Dialing…
              </div>
            </div>
            <button
              onClick={() => { setSosNotice(false); stopAlarm(); }}
              className="press-effect p-2 rounded-lg hover:bg-secondary"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Simulated SMS Popup */}
      {smsOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[hsl(222_45%_8%)] border border-primary/30 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6">
            {/* Phone-like header */}
            <div className="bg-[hsl(222_50%_5%)] px-5 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono tracking-widest text-primary">MESSAGES</span>
              </div>
              <button onClick={() => setSmsOpen(false)} className="press-effect p-1.5 rounded-md hover:bg-secondary" aria-label="Close SMS">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">To:</span>
                <span className="text-foreground font-semibold">Dad, Mom</span>
              </div>
              <div className="rounded-2xl rounded-br-sm bg-destructive/15 border border-destructive/40 px-4 py-3 text-sm">
                <div className="flex items-center gap-1.5 text-destructive font-bold mb-1">
                  <ShieldAlert className="h-4 w-4" /> EMERGENCY!
                </div>
                <p className="text-foreground/90 leading-snug">
                  I am at <span className="text-primary font-mono">[{LOCATION}]</span>. Help needed!
                </p>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  Live location attached · GuardianAI
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-success">
                <span>✓ Delivered</span>
                <span>{new Date().toLocaleTimeString("en-IN", { hour12: false })}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-[hsl(222_50%_5%)] border-t border-border">
              <a
                href="tel:112"
                className="press-effect rounded-xl py-3 bg-destructive text-destructive-foreground font-bold text-sm flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" /> Call 112
              </a>
              <button
                onClick={() => { setSmsOpen(false); stopAlarm(); }}
                className="press-effect rounded-xl py-3 border border-border text-foreground/80 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Mark Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
