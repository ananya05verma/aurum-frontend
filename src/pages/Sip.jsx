import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSip } from "../services/api";
import { NavBar, ErrorBanner, SuccessBanner, Loader } from "../services/UI";

const INITIAL_FORM = {
  fundName: "",
  schemeCode: "",
  monthlyAmount: "",
  startDate: "",
};

export default function Sip() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createSip({
        fundName: form.fundName,
        schemeCode: form.schemeCode,
        monthlyAmount: Number(form.monthlyAmount),
        startDate: form.startDate,
      });
      setSuccess(`SIP created successfully for "${form.fundName}"!`);
      setForm(INITIAL_FORM);
      // Take user back to dashboard so they can see updated SIP summary.
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create SIP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grain min-h-screen bg-surface-900">
      <NavBar />

      {/* Background glow */}
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/4 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10 fade-in">
          <p className="text-xs font-mono tracking-widest uppercase text-zinc-600 mb-1">
            Investments
          </p>
          <h1 className="text-3xl font-display font-semibold text-white">
            Create SIP
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Form ── */}
          <div className="lg:col-span-3 fade-in stagger-1">
            <div className="aurum-card p-8">
              <h2 className="text-sm font-display font-semibold text-white mb-1">
                New Systematic Investment Plan
              </h2>
              <p className="text-xs text-zinc-600 mb-7">
                Set up a recurring monthly investment in a mutual fund.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Fund Name */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                    Fund Name
                  </label>
                  <input
                    type="text"
                    name="fundName"
                    value={form.fundName}
                    onChange={handleChange}
                    placeholder="e.g. Axis Bluechip Fund"
                    required
                    className="input-gold w-full"
                  />
                </div>

                {/* Scheme Code */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                    Scheme Code
                  </label>
                  <input
                    type="text"
                    name="schemeCode"
                    value={form.schemeCode}
                    onChange={handleChange}
                    placeholder="e.g. 120503"
                    required
                    className="input-gold w-full"
                  />
                  <p className="mt-1.5 text-xs text-zinc-700">
                    AMFI scheme code for the mutual fund
                  </p>
                </div>

                {/* Monthly Amount */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                    Monthly Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="monthlyAmount"
                      value={form.monthlyAmount}
                      onChange={handleChange}
                      placeholder="5000"
                      min="100"
                      required
                      className="input-gold w-full pl-8"
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-zinc-500 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="input-gold w-full"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <ErrorBanner message={error} />
                <SuccessBanner message={success} />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
                      <span>Creating SIP…</span>
                    </>
                  ) : (
                    "Start SIP"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Info Panel ── */}
          <div className="lg:col-span-2 space-y-4 fade-in stagger-2">
            {/* What is SIP */}
            <div className="aurum-card p-6">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                <span className="text-gold-500 text-sm">$</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                What is a SIP?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                A Systematic Investment Plan (SIP) lets you invest a fixed amount
                regularly in mutual funds, leveraging rupee cost averaging and
                compounding over time.
              </p>
            </div>

            {/* Benefits */}
            <div className="aurum-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                SIP Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  "Rupee cost averaging",
                  "Power of compounding",
                  "Disciplined investing",
                  "Flexible amounts",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60 flex-shrink-0" />
                    <span className="text-xs text-zinc-500">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div className="rounded-xl border border-gold-800/30 bg-gold-950/20 p-5">
              <p className="text-xs font-mono text-gold-600 tracking-wider uppercase mb-2">
                Pro Tip
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Start early — even small monthly amounts grow significantly over
                10–15 years due to compounding.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
