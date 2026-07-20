import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthSplit } from "@/components/nexus/auth-split";
import { login as doLogin, getSession } from "@/lib/session-store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  useEffect(() => {
    // Handle Google OAuth callback tokens in URL
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, "", "/login");
      nav({ to: "/dashboard" });
      return;
    }

    const s = getSession();
    if (s) nav({ to: s.role === "Admin" ? "/admin" : "/dashboard" });
  }, [nav]);

  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(0);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email.trim()) { setErr("Email is required"); return; }
    if (!pw) { setErr("Password is required"); return; }
    setLoading(true);
    const result = await doLogin(email, pw);
    setLoading(false);
    if ("error" in result) {
      setErr(result.error);
      setShake((s) => s + 1);
      return;
    }
    const { session } = result;
    toast.success(session.role === "Admin" ? "Welcome back, Admin!" : "Welcome back!");
    nav({ to: session.role === "Admin" ? "/admin" : "/dashboard" });
  };

  return (
    <AuthSplit>
      <motion.form
        key={shake}
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-card"
      >
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        <div className="mt-6 space-y-4">
          <Field icon={<Mail className="w-4 h-4" />}>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="Email"
              className="bg-transparent outline-none w-full text-sm" />
          </Field>
          <Field icon={<Lock className="w-4 h-4" />}>
            <input value={pw} onChange={(e) => setPw(e.target.value)}
              type={show ? "text" : "password"} placeholder="Password"
              className="bg-transparent outline-none w-full text-sm" />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </Field>
          {err && <p className="text-xs text-danger">{err}</p>}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="accent-primary" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </motion.form>
    </AuthSplit>
  );
}

export function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="h-11 px-3 rounded-md border border-border bg-muted/40 flex items-center gap-2 focus-within:border-primary transition-colors">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}
