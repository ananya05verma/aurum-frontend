import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { AurumLogo, ErrorBanner, Loader } from "../services/UI";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      // Backend contract says: { token: "jwt_token" }
      // Some implementations may return the token as a plain string; support both.
      const rawToken =
        typeof res.data === "string"
          ? res.data
          : res.data?.token || res.headers?.authorization;
      const cleanedToken =
        typeof rawToken === "string" ? rawToken.replace(/^Bearer\s+/i, "") : "";

      if (!cleanedToken) {
        localStorage.removeItem("token");
        throw new Error("Login succeeded but no token was returned.");
      }

      localStorage.setItem("token", cleanedToken);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain min-h-screen flex items-center justify-center bg-surface-900 px-4">
      {/* Background glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <AurumLogo size="lg" />
          <p className="mt-2 text-xs font-mono tracking-widest uppercase text-zinc-600">
            Portfolio Intelligence
          </p>
        </div>

        {/* Card */}
        <div className="aurum-card p-8">
          <h1 className="text-lg font-display font-semibold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-zinc-600 mb-7">
            Sign in to your Aurum account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-gold w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-gold w-full"
              />
            </div>

            <ErrorBanner message={error} />

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  <span>Signing in…</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gold-500 hover:text-gold-400 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
