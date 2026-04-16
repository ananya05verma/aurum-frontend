// ─── StatCard ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, positive, negative, delay = "" }) {
  const valueColor =
    positive ? "text-green-400" :
    negative ? "text-red-400" :
    "text-white";

  return (
    <div className={`aurum-card card-lift p-6 fade-in ${delay}`}>
      <p className="text-xs font-mono tracking-widest uppercase text-zinc-500 mb-3">
        {label}
      </p>
      <p className={`text-2xl font-display font-semibold ${valueColor}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-zinc-600 mt-2 font-mono">{sub}</p>
      )}
    </div>
  );
}

// ─── Loader ──────────────────────────────────────────────────────────────────
export function Loader({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-surface-500 border-t-gold-500 animate-spin`}
    />
  );
}

// ─── ErrorBanner ─────────────────────────────────────────────────────────────
export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-red-800/60 bg-red-950/30 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
}

// ─── SuccessBanner ───────────────────────────────────────────────────────────
export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-green-800/60 bg-green-950/30 px-4 py-3 text-sm text-green-400">
      {message}
    </div>
  );
}

// ─── AurumLogo ────────────────────────────────────────────────────────────────
export function AurumLogo({ size = "md" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };
  return (
    <span className={`font-display font-semibold italic gold-shimmer ${sizes[size]}`}>
      Aurum
    </span>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
import { Link, useLocation, useNavigate } from "react-router-dom";

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors duration-200 ${
          active
            ? "text-gold-400"
            : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-700 bg-surface-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <AurumLogo size="sm" />
        <nav className="flex items-center gap-8">
          {navLink("/dashboard", "Dashboard")}
          {navLink("/sip", "SIP")}
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-600 hover:text-red-400 transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
