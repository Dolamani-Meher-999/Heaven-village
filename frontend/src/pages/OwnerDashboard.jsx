import { useState, useEffect } from "react";
import OwnerNavbar        from "../components/owner/OwnerNavbar";
import OwnerStatsBar      from "../components/owner/OwnerStatsBar";
import OwnerPropertyCard  from "../components/owner/OwnerPropertyCard";
import PropertyForm       from "../components/owner/PropertyForm";
import RentRequestsPanel  from "../components/owner/RentRequestsPanel";
import Footer             from "../components/Footer";

export default function OwnerDashboard({ user, onLogout }) {
  const [activeTab,    setActiveTab]    = useState("overview");
  const [properties,   setProperties]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [editProperty, setEditProperty] = useState(null);
  const token = localStorage.getItem("hv_token");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/properties/owner/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProperties(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${API}/api/properties/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (property) => {
    setEditProperty(property);
    setActiveTab("add");
  };

  const handleTabChange = (tab) => {
    if (tab === "logout") { onLogout(); return; }
    setActiveTab(tab);
    if (tab !== "add") setEditProperty(null);
  };

  const stats = {
    total:    properties.length,
    approved: properties.filter((p) => p.status === "approved").length,
    pending:  properties.filter((p) => p.status === "pending").length,
    rented:   properties.filter((p) => p.availabilityStatus === "rented").length,
    requests: 0,
  };

  return (
    <div className="min-h-screen bg-cream">
      <OwnerNavbar activeTab={activeTab} setActiveTab={handleTabChange} onLogout={onLogout} />

      <main className="max-w-[1200px] mx-auto px-8 pt-24 pb-16">

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-charcoal mb-1">
                Welcome back, {user?.name?.split(" ")[0] || JSON.parse(localStorage.getItem("hv_user") || "{}").name?.split(" ")[0]} 👋
              </h1>
              <p className="font-body text-charcoal/45">Here's an overview of your property portfolio.</p>
            </div>

            <OwnerStatsBar stats={stats} />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 orange-gradient rounded-full" />
                <h2 className="font-display text-xl font-bold text-charcoal">Recent Listings</h2>
              </div>
              <button onClick={() => setActiveTab("properties")}
                className="font-body text-sm font-semibold text-orange border-b border-orange/30 hover:border-orange transition-colors">
                View All →
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse h-72" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-20 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Properties Yet</h3>
                <p className="font-body text-sm text-charcoal/40 mb-6">Start by adding your first property listing.</p>
                <button onClick={() => setActiveTab("add")}
                  className="orange-gradient px-8 py-3 rounded-xl font-body text-sm font-bold text-white shadow-orange hover:opacity-90 transition-opacity">
                  + Add Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {properties.slice(0, 3).map((p) => (
                  <OwnerPropertyCard key={p._id} property={p} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon:"＋", label:"Add New Property",  desc:"List a new property for rent",        tab:"add",        color:"orange-gradient text-white shadow-orange" },
                { icon:"📋", label:"View Requests",      desc:"Manage incoming rent requests",       tab:"requests",   color:"bg-white border border-gray-200 text-charcoal" },
                { icon:"🏠", label:"My Listings",        desc:"View and manage all your properties", tab:"properties", color:"bg-white border border-gray-200 text-charcoal" },
              ].map((action) => (
                <button key={action.tab} onClick={() => setActiveTab(action.tab)}
                  className={`${action.color} rounded-2xl p-5 text-left hover:opacity-90 transition-all shadow-card hover:shadow-card-hover`}>
                  <div className="text-2xl mb-3">{action.icon}</div>
                  <div className="font-display text-base font-bold mb-1">{action.label}</div>
                  <div className={`font-body text-xs ${action.tab === "add" ? "text-white/70" : "text-charcoal/45"}`}>{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── MY PROPERTIES ────────────────────────────────────── */}
        {activeTab === "properties" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1 h-7 orange-gradient rounded-full" />
                  <h2 className="font-display text-2xl font-bold text-charcoal">My Properties</h2>
                </div>
                <p className="font-body text-sm text-charcoal/45 ml-4">{properties.length} total listings</p>
              </div>
              <button onClick={() => setActiveTab("add")}
                className="orange-gradient px-5 py-2.5 rounded-xl font-body text-sm font-bold text-white shadow-orange hover:opacity-90 transition-opacity flex items-center gap-2">
                ＋ Add Property
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse h-72" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-20 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Properties Yet</h3>
                <p className="font-body text-sm text-charcoal/40 mb-6">Click the button above to add your first listing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {properties.map((p) => (
                  <OwnerPropertyCard key={p._id} property={p} onDelete={handleDelete} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RENT REQUESTS ─────────────────────────────────────── */}
        {activeTab === "requests" && <RentRequestsPanel />}

        {/* ── ADD / EDIT PROPERTY ──────────────────────────────── */}
        {activeTab === "add" && (
          <PropertyForm
            editData={editProperty}
            onSuccess={() => { fetchProperties(); setActiveTab("properties"); setEditProperty(null); }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
