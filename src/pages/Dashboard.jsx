import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getSipSummary,
  getAiInsights,
  getHoldings,
  getSips,
} from "../services/api";
import { NavBar, StatCard, Loader } from "../services/UI";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return "₹" + n.toLocaleString("en-IN");
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(2) + "%";
};

function format2(value) {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(2);
}

function getPLSign(value) {
  if (value > 0) return "+";
  return "";
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function getFirstDefined(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return undefined;
}

function pickSummaryPayload(payload) {
  // Accept direct object OR common wrappers used in some Spring responses.
  return payload?.data || payload?.summary || payload?.sipSummary || payload;
}

function normalizeSummary(payload) {
  const data = pickSummaryPayload(payload);
  return {
    totalInvested: toNumber(
      getFirstDefined(data, ["totalInvested", "total_invested", "investedAmount", "amountInvested"])
    ),
    currentValue: toNumber(
      getFirstDefined(data, ["currentValue", "current_value", "marketValue", "presentValue"])
    ),
    profitLoss: toNumber(
      getFirstDefined(data, ["profitLoss", "profit_loss", "pnl", "gainLoss"])
    ),
    months: toNumber(
      getFirstDefined(data, ["months", "durationMonths", "monthCount", "tenureMonths"])
    ),
  };
}

function normalizeHolding(item) {
  return {
    fundName: item?.fundName || "Unknown Fund",
    invested: toNumber(getFirstDefined(item, ["invested", "totalInvested"])),
    currentValue: toNumber(getFirstDefined(item, ["currentValue", "current_value"])),
    units: toNumber(item?.units),
    profitLoss: toNumber(getFirstDefined(item, ["profitLoss", "profit_loss", "pnl"])),
    weight: toNumber(item?.weight),
  };
}

function normalizeSipItem(item) {
  return {
    fundName: item?.fundName || "Unknown Fund",
    schemeCode: item?.schemeCode || "—",
    monthlyAmount: toNumber(item?.monthlyAmount),
    startDate: item?.startDate || "—",
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-surface-600 rounded-lg animate-pulse ${className}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="aurum-card p-6">
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-7 w-32 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function AllocationTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;
  return (
    <div className="rounded-lg border border-surface-700 bg-surface-900/95 px-3 py-2 text-xs">
      <p className="text-zinc-200 font-medium">{item.fundName}</p>
      <p className="text-zinc-500">{formatPercent(item.weight)}</p>
    </div>
  );
}

// ─── AI Insights Panel ────────────────────────────────────────────────────────
function InsightsPanel() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await getAiInsights();
      setInsights(res.data);
      setFetched(true);
    } catch (err) {
      // Per requirement: remove error banners/messages. Just keep the CTA visible.
      setInsights("");
      setFetched(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aurum-card p-6 fade-in stagger-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-zinc-500">
            Investment Insights
          </p>
          <h2 className="text-white font-display font-semibold mt-1">
            AI Analysis
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute h-2 w-2 rounded-full bg-gold-400 opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-gold-500" />
          </span>
          <span className="text-xs font-mono text-gold-600">POWERED BY AURUM</span>
        </div>
      </div>

      {/* Content */}
      {!fetched && !loading && (
        <div className="text-center py-8">
          <p className="text-zinc-600 text-sm mb-5">
            Get personalised insights based on your portfolio data.
          </p>
          <button onClick={fetchInsights} className="btn-gold">
            Generate Insights
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <Loader size="lg" />
          <p className="text-xs font-mono text-zinc-600 animate-pulse">
            Analysing your portfolio…
          </p>
        </div>
      )}

      {fetched && !loading && insights && (
        <div className="space-y-4 fade-in">
          {/* Parse and display insights */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/60 via-gold-500/20 to-transparent" />
            <div className="pl-5">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {insights}
              </p>
            </div>
          </div>
          <button
            onClick={fetchInsights}
            className="text-xs font-mono text-zinc-600 hover:text-gold-500 transition-colors mt-2"
          >
            ↻ Refresh insights
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const location = useLocation();
  const [sip, setSip] = useState(null);
  const [loadingSip, setLoadingSip] = useState(true);
  const [holdings, setHoldings] = useState([]);
  const [sips, setSips] = useState([]);
  const [loadingHoldings, setLoadingHoldings] = useState(true);
  const [loadingSipList, setLoadingSipList] = useState(true);

  const fetchSip = useCallback(async () => {
    setLoadingSip(true);
    try {
      const res = await getSipSummary();
      setSip(normalizeSummary(res.data));
    } catch (err) {
      setSip(null);
    } finally {
      setLoadingSip(false);
    }
  }, []);

  const fetchHoldings = useCallback(async () => {
    setLoadingHoldings(true);
    try {
      const res = await getHoldings();
      const data = Array.isArray(res.data) ? res.data : [];
      setHoldings(data.map(normalizeHolding));
    } catch (err) {
      setHoldings([]);
    } finally {
      setLoadingHoldings(false);
    }
  }, []);

  const fetchSipList = useCallback(async () => {
    setLoadingSipList(true);
    try {
      const res = await getSips();
      const data = Array.isArray(res.data) ? res.data : [];
      setSips(data.map(normalizeSipItem));
    } catch (err) {
      setSips([]);
    } finally {
      setLoadingSipList(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchHoldings();
    fetchSipList();
    fetchSip();
  }, [fetchHoldings, fetchSipList, fetchSip]);

  // Initial load + refetch when returning to this route.
  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Refetch when user comes back to the tab/window.
  useEffect(() => {
    const onFocus = () => refreshAll();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshAll]);

  const plPositive = sip?.profitLoss > 0;
  const plNegative = sip?.profitLoss < 0;
  const hasAnyInvestments = holdings.length > 0 || sips.length > 0;

  const allocationData = holdings
    .filter(
      (h) =>
        typeof h.weight === "number" &&
        !Number.isNaN(h.weight) &&
        h.weight > 0 &&
        h.fundName
    )
    .map((h) => ({ fundName: h.fundName, weight: h.weight }));
  const COLORS = ["#D4AF37", "#FFD700", "#C0A020", "#B8962E"];

  const topFund =
    !loadingHoldings && holdings.length
      ? holdings.reduce((max, curr) =>
          (curr.weight ?? -1) > (max.weight ?? -1) ? curr : max
        )
      : null;

  return (
    <div className="grain min-h-screen bg-surface-900">
      <NavBar />

      {/* Background decoration */}
      <div className="fixed top-20 right-0 w-72 h-72 bg-gold-500/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-0 w-60 h-60 bg-gold-500/2 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10 fade-in">
          <p className="text-xs font-mono tracking-widest uppercase text-zinc-600 mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-display font-semibold text-white">
            Your Portfolio
          </h1>
        </div>

        {/* ── Portfolio Overview (SIP summary only) ── */}
        <section className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-zinc-600 mb-4 fade-in stagger-1">
            Portfolio Overview
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loadingSip ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Invested"
                  value={formatCurrency(sip?.totalInvested)}
                  delay="stagger-1"
                />
                <StatCard
                  label="Current Value"
                  value={formatCurrency(sip?.currentValue)}
                  delay="stagger-2"
                />
                <StatCard
                  label="Profit / Loss"
                  value={`${getPLSign(sip?.profitLoss || 0)}${formatCurrency(sip?.profitLoss)}`}
                  positive={plPositive}
                  negative={plNegative}
                  sub={
                    sip?.totalInvested
                      ? `${formatPercent(
                          ((sip?.profitLoss || 0) / sip.totalInvested) * 100
                        )} return`
                      : undefined
                  }
                  delay="stagger-3"
                />
                <StatCard
                  label="Duration"
                  value={`${sip?.months ?? 0} months invested`}
                  sub="Time in market"
                  delay="stagger-4"
                />
              </>
            )}
          </div>

          {!loadingHoldings && topFund?.fundName && typeof topFund?.weight === "number" && (
            <p className="text-zinc-400 mt-3 text-sm">
              Your largest allocation is{" "}
              <span className="text-gold-500">{topFund.fundName}</span> (
              {formatPercent(topFund.weight)})
            </p>
          )}

          {!loadingSip && !hasAnyInvestments && (
            <div className="mt-4 aurum-card p-6">
              <p className="text-sm text-zinc-400">Start your first SIP</p>
              <p className="text-xs text-zinc-600 mt-1">
                Once you create a SIP, your wealth overview and allocation will show here.
              </p>
              <div className="mt-4">
                <Link to="/sip" className="btn-gold inline-flex">
                  Create SIP
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Portfolio Allocation (Pie) ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 fade-in stagger-2">
            <p className="text-xs font-mono tracking-widest uppercase text-zinc-600">
              Portfolio Allocation
            </p>
            <button
              type="button"
              onClick={fetchHoldings}
              className="text-xs font-mono text-zinc-600 hover:text-gold-500 transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="aurum-card p-6 bg-gradient-to-br from-[#1a1a1a] to-[#111] hover:scale-[1.02] transition-all duration-300">
            {loadingHoldings ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : allocationData.length === 0 ? (
              <div>
                <p className="text-sm text-zinc-400">No investments yet</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Start your first SIP to see your allocation by fund.
                </p>
                <div className="mt-4">
                  <Link to="/sip" className="btn-gold inline-flex">
                    Create SIP
                  </Link>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="weight"
                    nameKey="fundName"
                    outerRadius={100}
                    label={({ percent }) => formatPercent(percent * 100)}
                    stroke="rgba(0,0,0,0)"
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<AllocationTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* ── My Investments ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 fade-in stagger-3">
            <p className="text-xs font-mono tracking-widest uppercase text-zinc-600">
              My Investments
            </p>
            <button
              type="button"
              onClick={fetchHoldings}
              className="text-xs font-mono text-zinc-600 hover:text-gold-500 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loadingHoldings ? (
            <div>
              <p className="text-sm text-zinc-500 mb-3">Loading...</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            </div>
          ) : holdings.length === 0 ? (
            <div className="aurum-card p-6">
              <p className="text-sm text-zinc-400">No investments yet</p>
              <p className="text-xs text-zinc-600 mt-1">Start your first SIP</p>
              <div className="mt-4">
                <Link to="/sip" className="btn-gold inline-flex">
                  Create SIP
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holdings.map((holding, idx) => (
                <div
                  key={`${holding.fundName}-${idx}`}
                  className="aurum-card card-lift p-7 bg-gradient-to-br from-[#1a1a1a] to-[#111] hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.08),0_10px_30px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-mono tracking-widest uppercase text-zinc-500 mb-1">
                        Fund
                      </p>
                      <h3 className="text-lg font-display font-semibold text-white">
                        {holding.fundName}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-gold-500">
                      {holding.weight !== undefined ? formatPercent(holding.weight) : "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="aurum-card bg-surface-900/30 p-4">
                      <p className="text-zinc-600 text-xs mb-1">Invested</p>
                      <p className="text-zinc-100 font-medium">{formatCurrency(holding.invested)}</p>
                    </div>
                    <div className="aurum-card bg-surface-900/30 p-4">
                      <p className="text-zinc-600 text-xs mb-1">Current</p>
                      <p className="text-zinc-100 font-medium">{formatCurrency(holding.currentValue)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-zinc-600 text-xs mb-1">Profit / Loss</p>
                      <p className={holding.profitLoss >= 0 ? "text-green-400" : "text-red-400"}>
                        {`${getPLSign(holding.profitLoss || 0)}${formatCurrency(holding.profitLoss)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-600 text-xs mb-1">Units</p>
                      <p className="text-zinc-200 font-mono">
                        {holding.units !== undefined ? format2(holding.units) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-14">
          <div className="flex items-center justify-between mb-4 fade-in stagger-4">
            <p className="text-xs font-mono tracking-widest uppercase text-zinc-600">
              SIP List
            </p>
            <button
              type="button"
              onClick={fetchSipList}
              className="text-xs font-mono text-zinc-600 hover:text-gold-500 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loadingSipList ? (
            <div>
              <p className="text-sm text-zinc-500 mb-3">Loading...</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            </div>
          ) : sips.length === 0 ? (
            <div className="aurum-card p-6">
              <p className="text-sm text-zinc-400">No investments yet</p>
              <p className="text-xs text-zinc-600 mt-1">Start your first SIP</p>
              <div className="mt-4">
                <Link to="/sip" className="btn-gold inline-flex">
                  Create SIP
                </Link>
              </div>
            </div>
          ) : (
            <div className="aurum-card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-700">
                  <tr>
                    <th className="px-6 py-4 text-xs font-mono tracking-widest uppercase text-zinc-500">Fund Name</th>
                    <th className="px-6 py-4 text-xs font-mono tracking-widest uppercase text-zinc-500">Monthly Amount</th>
                    <th className="px-6 py-4 text-xs font-mono tracking-widest uppercase text-zinc-500">Start Date</th>
                    <th className="px-6 py-4 text-xs font-mono tracking-widest uppercase text-zinc-500">Scheme Code</th>
                  </tr>
                </thead>
                <tbody>
                  {sips.map((sipItem, idx) => (
                    <tr
                      key={`${sipItem.fundName}-${sipItem.schemeCode}-${idx}`}
                      className="border-b border-surface-800/70 hover:bg-surface-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-zinc-200">{sipItem.fundName}</td>
                      <td className="px-6 py-4 text-zinc-200">{formatCurrency(sipItem.monthlyAmount)}</td>
                      <td className="px-6 py-4 text-zinc-300">{sipItem.startDate}</td>
                      <td className="px-6 py-4 text-zinc-400">{sipItem.schemeCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <InsightsPanel />
        </section>
      </main>
    </div>
  );
}
