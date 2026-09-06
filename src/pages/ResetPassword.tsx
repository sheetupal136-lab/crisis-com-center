import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Recovery link lands here with type=recovery in the URL hash
    if (window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords match nahi ho rahe.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated! Ab naye password se sign in karein.");
      navigate("/auth", { replace: true });
    } catch (err: any) {
      toast.error(err?.message ?? "Password update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mode-default">
      <div className="ambient-overlay" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div
            className="inline-flex w-14 h-14 rounded-2xl bg-primary/15 border border-primary/50 items-center justify-center mb-3"
            style={{ boxShadow: "var(--glow-cyan)" }}
          >
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-[0.2em] neon-text-cyan">
            GUARDIAN<span className="text-foreground">AI</span>
          </h1>
          <p className="text-xs font-mono text-muted-foreground tracking-widest mt-1">
            PASSWORD RECOVERY
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          {ready ? (
            <form onSubmit={handle} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <button
                disabled={busy}
                className="press-effect w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ boxShadow: "var(--glow-cyan)" }}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                UPDATE PASSWORD
              </button>
            </form>
          ) : (
            <div className="text-center space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Reset link verify ho raha hai... Agar yeh page khula rahe, toh link expire ho gaya hai —{" "}
                <button onClick={() => navigate("/auth")} className="text-primary underline">
                  naya reset link bhejein
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
