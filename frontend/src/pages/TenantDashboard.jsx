import { useState, useEffect, useRef } from "react";
import TenantNavbar        from "../components/tenant/TenantNavbar";
import TenantHero          from "../components/tenant/TenantHero";
import SearchFilter        from "../components/tenant/SearchFilter";
import PropertyGrid        from "../components/tenant/PropertyGrid";
import PropertyCard        from "../components/tenant/PropertyCard";
import PropertyDetailModal from "../components/tenant/PropertyDetailModal";
import RentRequestModal    from "../components/tenant/RentRequestModal";
import Footer              from "../components/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── My Requests Panel ───────────────────────────────────────────────────────
function MyRequests({ onViewDetails }) {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const token = localStorage.getItem("hv_token");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/rent-requests/tenant`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const STATUS = {
    pending:   { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
    approved:  { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
    rejected:  { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
    cancelled: { bg: "#F3F4F6", color: "#4B5563", dot: "#9CA3AF" },
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this rent request?")) return;
    try {
      await fetch(`${API}/api/rent-requests/${id}/cancel`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` },
      });
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: "cancelled" } : r));
    } catch (err) { console.error(err); }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
          <h2 className="font-display text-2xl font-bold text-charcoal">My Rent Requests</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-body bg-cream text-charcoal/50">{filtered.length}</span>
        </div>
        <div className="flex gap-1 bg-cream rounded-xl p-1">
          {["all", "pending", "approved", "rejected", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize transition-all"
              style={filter === f
                ? { background: "linear-gradient(135deg,#E8621A,#F5874A)", color: "#fff" }
                : { color: "rgba(26,26,46,0.5)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" style={{ border: "1px solid rgba(26,26,46,0.07)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl py-24 text-center" style={{ border: "1px solid rgba(26,26,46,0.07)" }}>
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Requests Yet</h3>
          <p className="font-body text-sm text-charcoal/40">Browse properties and click "Request Rent" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const st  = STATUS[r.status] || STATUS.pending;
            const img = r.property?.images?.[0]?.url || r.property?.images?.[0]
              || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80";
            return (
              <div key={r._id} className="bg-white rounded-2xl overflow-hidden flex transition-all hover:shadow-card-hover"
                style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 2px 12px rgba(26,26,46,0.05)" }}>
                <div className="w-36 flex-shrink-0 cursor-pointer" onClick={() => r.property && onViewDetails?.(r.property)}>
                  <img src={img} alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80"; }} />
                </div>
                <div className="flex-1 p-5 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-base font-bold text-charcoal truncate">{r.property?.title || "Property"}</h3>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-body flex-shrink-0 capitalize"
                      style={{ background: st.bg, color: st.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                      {r.status}
                    </span>
                  </div>
                  <p className="font-body text-sm text-charcoal/45 mb-2">📍 {r.property?.location?.address}, {r.property?.location?.city}</p>
                  <div className="flex items-center gap-4 font-body text-xs text-charcoal/40">
                    <span className="font-semibold text-orange text-sm">₹{r.property?.price?.toLocaleString("en-IN")}/mo</span>
                    {r.moveInDate && <span>📅 {new Date(r.moveInDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>}
                    <span>🕐 {new Date(r.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                  </div>
                  {r.message && <p className="font-body text-xs text-charcoal/35 mt-1.5 italic truncate">"{r.message}"</p>}
                </div>
                <div className="flex items-center px-5 flex-shrink-0">
                  {r.status === "pending" && (
                    <button onClick={() => handleCancel(r._id)}
                      className="px-4 py-2 rounded-xl font-body text-xs font-bold"
                      style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid rgba(239,68,68,0.2)" }}>
                      Cancel
                    </button>
                  )}
                  {r.status === "approved" && <div className="text-center"><div className="text-2xl">🎉</div><div className="font-body text-xs font-bold text-green-600">Approved!</div></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── TenantDashboard ─────────────────────────────────────────────────────────
export default function TenantDashboard({ user, onLogout }) {
  const [activeTab,        setActiveTab]        = useState("browse");
  const [filters,          setFilters]          = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailProperty,   setDetailProperty]   = useState(null);
  const [savedProperties,  setSavedProperties]  = useState([]);
  const browseTopRef = useRef(null);

  const handleTabChange = (tab) => {
    if (tab === "logout") { onLogout(); return; }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveToggle = (property, isSaved) => {
    if (isSaved) {
      setSavedProperties((prev) => prev.find((p) => p._id === property._id) ? prev : [...prev, property]);
    } else {
      setSavedProperties((prev) => prev.filter((p) => p._id !== property._id));
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <TenantNavbar activeTab={activeTab} setActiveTab={handleTabChange} onLogout={onLogout} />

      {activeTab === "browse" && (
        <TenantHero onSearch={(q) => setFilters((f) => ({ ...f, ...q }))} />
      )}

      <main className="w-full px-4 py-12" style={{ paddingTop: activeTab !== "browse" ? "96px" : "48px" }}>

        {activeTab === "browse" && (
          <div ref={browseTopRef}>
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-1 h-8 orange-gradient rounded-full" />
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal">Available Properties</h2>
                <p className="font-body text-sm text-charcoal/45">Browse all verified listings</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <SearchFilter onFilter={(f) => setFilters(f)} />
              <PropertyGrid
                filters={filters}
                onRequestRent={(p) => setSelectedProperty(p)}
                onSaveToggle={handleSaveToggle}
                onViewDetails={(p) => setDetailProperty(p)}
              />
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
              <h2 className="font-display text-2xl font-bold text-charcoal">Saved Properties</h2>
              {savedProperties.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-body text-white"
                  style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                  {savedProperties.length}
                </span>
              )}
            </div>

            {savedProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-6xl mb-4">♡</div>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-2">No Saved Properties</h3>
                <p className="font-body text-sm text-charcoal/45 max-w-xs mb-6">
                  Click the heart icon on any property card to save it here.
                </p>
                <button onClick={() => handleTabChange("browse")}
                  className="orange-gradient px-8 py-3 rounded-xl font-body text-sm font-bold text-white shadow-orange hover:opacity-90">
                  Browse Properties →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {savedProperties.map((p) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    onRequestRent={(p) => setSelectedProperty(p)}
                    onSaveToggle={handleSaveToggle}
                    onViewDetails={(p) => setDetailProperty(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="max-w-[1200px] mx-auto">
            <MyRequests onViewDetails={(p) => setDetailProperty(p)} />
          </div>
        )}
      </main>

      <Footer />

      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onRequestRent={(p) => setSelectedProperty(p)}
        />
      )}

      {selectedProperty && (
        <RentRequestModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
