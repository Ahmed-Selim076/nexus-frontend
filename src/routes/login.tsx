import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthSplit } from "@/components/nexus/auth-split";
import { login as doLogin, getSession } from "@/lib/session-store";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5144/api";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

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

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <a
            href={`${API_BASE_URL}/auth/google/login`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-border bg-muted/40 text-sm font-medium hover:bg-muted/70 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </a>

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
