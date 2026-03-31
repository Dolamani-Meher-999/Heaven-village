import { useState, useEffect } from "react";
import AdminNavbar            from "../components/admin/AdminNavbar";
import AdminStatsBar          from "../components/admin/AdminStatsBar";
import PendingPropertiesPanel from "../components/admin/PendingPropertiesPanel";
import UsersPanel             from "../components/admin/UsersPanel";
import AdminRentRequestsPanel from "../components/admin/AdminRentRequestsPanel";
import Footer                 from "../components/Footer";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats,     setStats]     = useState({});
  const token = localStorage.getItem("hv_token");
  const user  = JSON.parse(localStorage.getItem("hv_user") || "{}");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    (async () => {
      try {
        const [propsRes, usersRes, reqsRes] = await Promise.all([
          fetch(`${API}/api/admin/properties`,    { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/admin/users`,         { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/admin/rent-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [pd, ud, rd] = await Promise.all([propsRes.json(), usersRes.json(), reqsRes.json()]);
        const ap = pd.data || [], au = ud.data || [], ar = rd.data || [];
        setStats({
          totalProperties: ap.length,
          pending:  ap.filter((p) => p.status === "pending").length,
          approved: ap.filter((p) => p.status === "approved").length,
          totalUsers:   au.length,
          activeUsers:  au.filter((u) => u.isActive !== false).length,
          rentRequests: ar.length,
        });
      } catch (err) { console.error(err); }
    })();
  }, [activeTab]);

  return (
    <div className="min-h-screen" style={{ background: "#F4F3F0" }}>
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-[1280px] mx-auto px-8 pt-24 pb-16">

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div>

            {/* Hero Banner — pure CSS, no external images needed */}
            <div className="relative rounded-3xl overflow-hidden mb-8"
              style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 55%,#0F3460 100%)", minHeight: 220 }}>

              {/* Concentric circle decorations */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[300, 420, 540, 660, 780].map((size, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    width: size, height: size, borderRadius: "50%",
                    border: "1px solid rgba(232,98,26,0.12)",
                    right: -size / 3, top: "50%",
                    transform: "translateY(-50%)",
                  }} />
                ))}
              </div>

              {/* Grid dot pattern (left half) */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: "radial-gradient(circle, rgba(232,98,26,0.12) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                maskImage: "linear-gradient(to right, transparent, rgba(0,0,0,0.4) 20%, transparent 60%)",
              }} />

              {/* Left orange accent bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full"
                style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)", borderRadius: "12px 0 0 12px" }} />

              {/* Main content */}
              <div className="relative z-10 px-12 py-10 flex items-center justify-between">
                <div className="flex-1">
                  {/* Status pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                      All Systems Operational
                    </span>
                  </div>

                  {/* Greeting */}
                  <h1 className="font-display font-bold text-white leading-tight mb-2" style={{ fontSize: 42 }}>
                    {greeting},{" "}
                    <span style={{ color: "#F5874A" }}>{user.name?.split(" ")[0]}</span> 👋
                  </h1>
                  <p className="font-body text-white/40 mb-7" style={{ fontSize: 14 }}>{today}</p>

                  {/* Quick metric pills */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {[
                      { label: "Properties Live",  val: stats.approved    ?? "—", color: "#10B981" },
                      { label: "Awaiting Review",  val: stats.pending     ?? "—", color: "#F59E0B", pulse: (stats.pending ?? 0) > 0 },
                      { label: "Active Users",     val: stats.activeUsers ?? "—", color: "#818CF8" },
                      { label: "Rent Requests",    val: stats.rentRequests ?? "—", color: "#F5874A" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                        <span className={`w-2 h-2 rounded-full ${m.pulse ? "animate-pulse" : ""}`}
                          style={{ background: m.color }} />
                        <span className="font-display text-base font-bold text-white">{m.val}</span>
                        <span className="font-body text-xs text-white/40">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: SVG donut ring */}
                <div className="flex-shrink-0 ml-10 mr-4">
                  <div className="relative" style={{ width: 148, height: 148 }}>
                    <svg viewBox="0 0 148 148" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle cx="74" cy="74" r="58" fill="none"
                        stroke="rgba(255,255,255,0.05)" strokeWidth="14"/>
                      <circle cx="74" cy="74" r="58" fill="none"
                        stroke="url(#donutGrad)" strokeWidth="14" strokeLinecap="round"
                        strokeDasharray={`${((( stats.approved ?? 0) / Math.max(stats.totalProperties ?? 1, 1)) * 364).toFixed(0)} 364`}/>
                      <defs>
                        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#E8621A"/>
                          <stop offset="100%" stopColor="#F5874A"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display font-bold text-white" style={{ fontSize: 32, lineHeight: 1 }}>
                        {stats.totalProperties ?? "—"}
                      </span>
                      <span className="font-body text-white/40 uppercase tracking-wider mt-1" style={{ fontSize: 10 }}>
                        Properties
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <AdminStatsBar stats={stats} />

            {/* Quick Action Cards */}
            <div className="grid grid-cols-3 gap-5 mb-10">
              {[
                {
                  icon: "⏳", label: "Review Pending",
                  desc: "Approve or reject new property listings",
                  tab: "properties",
                  bg: "linear-gradient(135deg,#E8621A 0%,#F5874A 100%)",
                  shadow: "0 12px 32px rgba(232,98,26,0.3)",
                  badge: stats.pending,
                },
                {
                  icon: "👥", label: "Manage Users",
                  desc: "View accounts and manage access levels",
                  tab: "users",
                  bg: "linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",
                  shadow: "0 12px 32px rgba(79,70,229,0.25)",
                },
                {
                  icon: "📋", label: "Rent Requests",
                  desc: "Monitor all rental activity platform-wide",
                  tab: "requests",
                  bg: "linear-gradient(135deg,#059669 0%,#10B981 100%)",
                  shadow: "0 12px 32px rgba(5,150,105,0.25)",
                  badge: stats.rentRequests,
                },
              ].map((a) => (
                <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                  className="relative overflow-hidden rounded-2xl p-7 text-left text-white group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{ background: a.bg, boxShadow: a.shadow }}>
                  {(a.badge ?? 0) > 0 && (
                    <div className="absolute top-4 right-4 min-w-[28px] h-7 px-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-body text-xs font-bold border border-white/20">
                      {a.badge}
                    </div>
                  )}
                  <div className="text-3xl mb-5 transition-transform duration-300 group-hover:scale-110">{a.icon}</div>
                  <div className="font-display text-xl font-bold mb-2">{a.label}</div>
                  <div className="font-body text-sm text-white/55 leading-relaxed">{a.desc}</div>
                  <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/[0.04] transition-transform duration-300 group-hover:scale-125" />
                  <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-white/[0.03]" />
                  <div className="absolute bottom-4 right-4 font-body text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    View →
                  </div>
                </button>
              ))}
            </div>

            {/* Pending Approvals section — single clean heading */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full"
                  style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
                <h2 className="font-display text-2xl font-bold text-charcoal">Pending Approvals</h2>
                {(stats.pending ?? 0) > 0 && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold font-body text-white"
                    style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                    {stats.pending} new
                  </span>
                )}
              </div>
              <button onClick={() => setActiveTab("properties")}
                className="font-body text-sm font-semibold text-orange hover:text-orange-dark transition-colors">
                View All →
              </button>
            </div>

            {(stats.pending ?? 0) === 0 ? (
              <div className="bg-white rounded-2xl px-8 py-10 flex items-center gap-6"
                style={{ border: "1px solid rgba(16,185,129,0.2)", boxShadow: "0 2px 16px rgba(16,185,129,0.05)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)" }}>✅</div>
                <div>
                  <h3 className="font-display text-lg font-bold text-charcoal mb-0.5">All Caught Up!</h3>
                  <p className="font-body text-sm text-charcoal/45">No properties are currently waiting for your approval.</p>
                </div>
              </div>
            ) : (
              <PendingPropertiesPanel filterAll={false} />
            )}

          </div>
        )}

        {activeTab === "properties" && <PendingPropertiesPanel filterAll={true} />}
        {activeTab === "users"      && <UsersPanel />}
        {activeTab === "requests"   && <AdminRentRequestsPanel />}

      </main>
      <Footer />
    </div>
  );
}
