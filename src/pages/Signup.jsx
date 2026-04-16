import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import { AurumLogo, ErrorBanner, SuccessBanner, Loader } from "../services/UI";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain min-h-screen flex items-center justify-center bg-surface-900 px-4">
      {/* Background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-500/4 rounded-full blur-3xl pointer-events-none" />

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
            Create your account
          </h1>
          <p className="text-xs text-zinc-600 mb-7">
            Start tracking your wealth with Aurum
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="input-gold w-full"
              />
            </div>

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
                minLength={6}
                className="input-gold w-full"
              />
            </div>

            <ErrorBanner message={error} />
            <SuccessBanner message={success} />

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  <span>Creating account…</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gold-500 hover:text-gold-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
