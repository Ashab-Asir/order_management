import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { Navigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) return <Navigate to="/orders/new" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form))
      .unwrap()
      .then(() => {
        toast.success("Logged in successfully");
      })
      .catch((err) => {
        toast.error(err || "Login failed");
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/25 blur-3xl" />

        <div className="bg-slate-900/70 border border-white/10 shadow-2xl shadow-emerald-500/20 rounded-2xl overflow-hidden backdrop-blur-xl grid md:grid-cols-[1.1fr,0.9fr]">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-sky-500">
                <LockKeyhole className="h-4 w-4 text-slate-900" />
              </span>
              <h1 className="text-xl font-semibold">Welcome back</h1>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs mb-1 text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 placeholder:text-slate-500"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1 text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-slate-900/70 border border-slate-700/70 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500/70 placeholder:text-slate-500"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-900 font-medium rounded-lg py-2 mt-2 text-sm disabled:opacity-60 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
