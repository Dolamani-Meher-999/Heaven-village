import { useState, useEffect } from "react";
import AdminNavbar             from "../components/admin/AdminNavbar";
import AdminStatsBar           from "../components/admin/AdminStatsBar";
import PendingPropertiesPanel  from "../components/admin/PendingPropertiesPanel";
import UsersPanel              from "../components/admin/UsersPanel";
import AdminRentRequestsPanel  from "../components/admin/AdminRentRequestsPanel";
import Footer                  from "../components/Footer";

const API = "http://localhost:5000";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats,     setStats]     = useState({});
  const token = localStorage.getItem("hv_token");
  const user  = JSON.parse(localStorage.getItem("hv_user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propsRes, usersRes, reqsRes] = await Promise.all([
          fetch(`${API}/api/admin/properties`,     { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/admin/users`,          { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/admin/rent-requests`,  { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [propsData, usersData, reqsData] = await Promise.all([
          propsRes.json(), usersRes.json(), reqsRes.json(),
        ]);

        const allProps = propsData.data  || [];
        const allUsers = usersData.data  || [];
        const allReqs  = reqsData.data   || [];

        setStats({
          totalProperties: allProps.length,
          pending:         allProps.filter((p) => p.status === "pending").length,
          approved:        allProps.filter((p) => p.status === "approved").length,
          totalUsers:      allUsers.length,
          activeUsers:     allUsers.filter((u) => u.isActive !== false).length,
          rentRequests:    allReqs.length,
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, [activeTab]); // refresh stats when tab changes

  return (
    <div className="min-h-screen bg-cream">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-[1200px] mx-auto px-8 pt-24 pb-16">

        {/* ── OVERVIEW ──────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div>
            {/* Welcome banner */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-charcoal mb-1">
                Welcome, {user.name?.split(" ")[0]} 👋
              </h1>
              <p className="font-body text-charcoal/45">Here's the full platform overview.</p>
            </div>

            <AdminStatsBar stats={stats} />

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: "⏳", label: "Review Pending",    desc: "Approve or reject new listings",      tab: "properties", color: "orange-gradient text-white shadow-orange" },
                { icon: "👥", label: "Manage Users",      desc: "View and deactivate user accounts",   tab: "users",      color: "bg-white border border-gray-200 text-charcoal" },
                { icon: "📋", label: "Rent Requests",     desc: "Monitor all rental activity",         tab: "requests",   color: "bg-white border border-gray-200 text-charcoal" },
              ].map((a) => (
                <button
                  key={a.tab}
                  onClick={() => setActiveTab(a.tab)}
                  className={`${a.color} rounded-2xl p-5 text-left hover:opacity-90 transition-all shadow-card hover:shadow-card-hover`}
                >
                  <div className="text-2xl mb-3">{a.icon}</div>
                  <div className="font-display text-base font-bold mb-1">{a.label}</div>
                  <div className={`font-body text-xs ${a.tab === "properties" ? "text-white/70" : "text-charcoal/45"}`}>{a.desc}</div>
                </button>
              ))}
            </div>

            {/* Pending properties preview */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 orange-gradient rounded-full" />
                <h2 className="font-display text-xl font-bold text-charcoal">Pending Approvals</h2>
                {stats.pending > 0 && (
                  <span className="orange-gradient text-white text-xs font-bold font-body px-2 py-0.5 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveTab("properties")}
                className="font-body text-sm font-semibold text-orange border-b border-orange/30 hover:border-orange transition-colors"
              >
                View All →
              </button>
            </div>

            <PendingPropertiesPanel filterAll={false} />
          </div>
        )}

        {/* ── PROPERTIES ─────────────────────────────────────────── */}
        {activeTab === "properties" && <PendingPropertiesPanel filterAll={true} />}

        {/* ── USERS ──────────────────────────────────────────────── */}
        {activeTab === "users" && <UsersPanel />}

        {/* ── RENT REQUESTS ──────────────────────────────────────── */}
        {activeTab === "requests" && <AdminRentRequestsPanel />}
      </main>

      <Footer />
    </div>
  );
}
