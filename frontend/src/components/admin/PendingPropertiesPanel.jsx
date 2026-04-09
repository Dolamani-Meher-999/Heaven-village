import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80",
];
const getFallback = (id) =>
  FALLBACK_IMAGES[(id?.charCodeAt(id?.length - 1) ?? 0) % FALLBACK_IMAGES.length];

const STATUS_STYLES = {
  pending:  { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B", label: "Pending"  },
  approved: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981", label: "Approved" },
  rejected: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444", label: "Rejected" },
};

export default function PendingPropertiesPanel({ filterAll = false }) {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState(filterAll ? "all" : "pending");
  const [actionId,   setActionId]   = useState(null);
  const [hoverId,    setHoverId]    = useState(null);
  const [refresh,    setRefresh]    = useState(0); // bump to force re-fetch
  const token = localStorage.getItem("hv_token");

  // ✅ Accepts explicit filter so it never reads a stale closure value
  const fetchProperties = async (currentFilter) => {
    const f = currentFilter ?? filter;
    setLoading(true);
    try {
      const query = f !== "all" ? `?status=${f}&limit=100` : "?limit=100";
      const res   = await fetch(`${API}/api/admin/properties${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setProperties(data.data || []);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the filter tab changes OR refresh counter bumps
  useEffect(() => { fetchProperties(filter); }, [filter, refresh]);

  const handleApprove = async (id) => {
    setActionId(id + "_approve");
    try {
      const res = await fetch(`${API}/api/admin/properties/${id}/approve`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // ✅ Remove from list immediately — don't wait for re-fetch
        setProperties((prev) => prev.filter((p) => p._id !== id));
        // Then sync from server after short delay
        setTimeout(() => setRefresh((n) => n + 1), 300);
      }
    } catch (err) { console.error(err); }
    finally { setActionId(null); }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this property listing?")) return;
    setActionId(id + "_reject");
    try {
      const res = await fetch(`${API}/api/admin/properties/${id}/reject`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // ✅ Remove from list immediately — don't wait for re-fetch
        setProperties((prev) => prev.filter((p) => p._id !== id));
        // Then sync from server after short delay
        setTimeout(() => setRefresh((n) => n + 1), 300);
      }
    } catch (err) { console.error(err); }
    finally { setActionId(null); }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-8 rounded-full"
              style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
            <h2 className="font-display text-2xl font-bold text-charcoal">
              {filterAll ? "All Properties" : "Pending Approvals"}
            </h2>
            {properties.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-body text-white"
                style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                {properties.length}
              </span>
            )}
          </div>
          <p className="font-body text-sm text-charcoal/40 ml-4">
            {filterAll
              ? `${properties.length} properties found`
              : "Review and approve new listings"}
          </p>
        </div>

        {/* Filter tabs — only in "All Properties" view */}
        {filterAll && (
          <div className="flex gap-2 bg-cream rounded-xl p-1">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-lg font-body text-xs font-semibold capitalize transition-all"
                style={filter === f
                  ? { background: "linear-gradient(135deg,#E8621A,#F5874A)", color: "#fff", boxShadow: "0 4px 12px rgba(232,98,26,0.25)" }
                  : { color: "rgba(26,26,46,0.5)" }}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse"
              style={{ height: 280, border: "1px solid rgba(26,26,46,0.06)" }}>
              <div className="h-44 bg-cream-dark" />
              <div className="p-5 space-y-2">
                <div className="h-4 bg-cream-dark rounded w-3/4" />
                <div className="h-3 bg-cream-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-3xl py-24 text-center"
          style={{ border: "1px solid rgba(26,26,46,0.06)" }}>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">All Clear!</h3>
          <p className="font-body text-sm text-charcoal/40">No properties in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {properties.map((p) => {
            const st        = STATUS_STYLES[p.status] || STATUS_STYLES.pending;
            const img       = p.images?.[0]?.url
              || (typeof p.images?.[0] === "string" ? p.images[0] : null)
              || getFallback(p._id);
            const isHovered = hoverId === p._id;

            return (
              <div key={p._id}
                className="bg-white rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  border: "1px solid rgba(26,26,46,0.07)",
                  boxShadow: isHovered
                    ? "0 16px 48px rgba(26,26,46,0.14)"
                    : "0 2px 16px rgba(26,26,46,0.06)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHoverId(p._id)}
                onMouseLeave={() => setHoverId(null)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img src={img} alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                    onError={(e) => { e.target.src = getFallback(p._id); }} />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(26,26,46,0.55) 0%, transparent 60%)" }} />

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body backdrop-blur-sm"
                      style={{ background: st.bg, color: st.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                      {st.label}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4">
                    <span className="font-display text-white text-xl font-bold drop-shadow">
                      ₹{p.price?.toLocaleString("en-IN")}
                      <span className="font-body text-sm font-normal text-white/70">/mo</span>
                    </span>
                  </div>

                  {/* Property type */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold font-body text-white capitalize backdrop-blur-sm"
                      style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
                      {p.propertyType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-charcoal mb-1 truncate">
                    {p.title}
                  </h3>

                  {/* ✅ Correct nested location fields */}
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-orange text-xs">📍</span>
                    <span className="font-body text-sm text-charcoal/50 truncate">
                      {p.location?.address
                        ? `${p.location.address}, ${p.location.city}`
                        : p.location?.city || "Location not specified"}
                    </span>
                  </div>

                  {/* Beds / Baths */}
                  <div className="flex items-center gap-3 mb-4">
                    {[
                      { icon: "🛏", val: `${p.bedrooms ?? 0} Beds`  },
                      { icon: "🚿", val: `${p.bathrooms ?? 0} Baths` },
                    ].map((d) => (
                      <div key={d.val}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream"
                        style={{ border: "1px solid rgba(26,26,46,0.06)" }}>
                        <span className="text-xs">{d.icon}</span>
                        <span className="font-body text-xs font-semibold text-charcoal/60">{d.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Owner info */}
                  {p.owner && (
                    <div className="flex items-center gap-2 mb-4 pb-4"
                      style={{ borderBottom: "1px solid rgba(26,26,46,0.06)" }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                        {p.owner.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-body text-xs font-semibold text-charcoal/70">
                          {p.owner.name}
                        </span>
                        <span className="font-body text-xs text-charcoal/40 ml-1">
                          · {p.owner.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons — only for pending */}
                  {p.status === "pending" && (
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(p._id)}
                        disabled={actionId?.startsWith(p._id)}
                        className="flex-1 py-2.5 rounded-xl font-body text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg,#10B981,#34D399)", boxShadow: "0 4px 12px rgba(16,185,129,0.25)" }}>
                        {actionId === p._id + "_approve" ? "Approving…" : "✓ Approve"}
                      </button>
                      <button onClick={() => handleReject(p._id)}
                        disabled={actionId?.startsWith(p._id)}
                        className="flex-1 py-2.5 rounded-xl font-body text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {actionId === p._id + "_reject" ? "Rejecting…" : "✕ Reject"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
