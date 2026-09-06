import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user && !loading) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  if (user) return <Navigate to="/" replace />;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFormError("");
    const normalizedEmail = email.trim().toLowerCase();
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link bhej diya — apna email inbox check karein.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || normalizedEmail.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — you can sign in now.");
        setMode("signin");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        if (!data.session) throw new Error("Login session start nahi ho saka. Dobara try karein.");
        toast.success("Welcome back, Guardian.");
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      const invalidCredentials = err instanceof AuthError && err.code === "invalid_credentials";
      const message = invalidCredentials
        ? "Email ya password galat hai. Password yaad nahi hai toh neeche Reset Password dabayein."
        : err instanceof Error
          ? err.message
          : "Authentication failed";
      setFormError(message);
      toast.error(message);
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
            CRISIS COMMAND ACCESS · v2.4.1
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl mb-5">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handle} className="space-y-3">
            {mode === "signup" && (
              <Field icon={UserIcon} placeholder="Display name" value={name} onChange={setName} />
            )}
            <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
            {mode !== "forgot" && (
              <Field icon={Lock} type="password" placeholder="Password (min 6 chars)" value={password} onChange={setPassword} required minLength={6} />
            )}

            {mode === "signin" && (
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline w-full text-right"
              >
                Reset Password
              </button>
            )}

            {formError && (
              <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {formError}
              </div>
            )}

            <button
              disabled={busy}
              className="press-effect w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ boxShadow: "var(--glow-cyan)" }}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "ENTER COMMAND CENTER" : mode === "signup" ? "REQUEST ACCESS" : "SEND RESET LINK"}
            </button>

            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
              >
                ← Back to Sign In
              </button>
            )}
          </form>

          <p className="mt-4 text-[11px] font-mono text-muted-foreground text-center">
            New accounts join as <span className="text-primary">FAMILY</span>. Responder role granted by admin.
          </p>
        </div>
      </div>
    </div>
  );
};

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  icon: any; value: string; onChange: (v: string) => void;
};
const Field = ({ icon: Icon, value, onChange, ...rest }: FieldProps) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
      {...rest}
    />
  </div>
);

export default Auth;
