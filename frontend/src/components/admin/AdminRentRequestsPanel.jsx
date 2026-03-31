import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=80",
];
const getFallback = (id) => FALLBACK_IMAGES[(id?.charCodeAt(id?.length - 1) ?? 0) % FALLBACK_IMAGES.length];

const STATUS_STYLES = {
  pending:   { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  approved:  { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  rejected:  { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
  cancelled: { bg: "#F3F4F6", color: "#4B5563", dot: "#9CA3AF" },
};

export default function AdminRentRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const token = localStorage.getItem("hv_token");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/admin/rent-requests`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setRequests(data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
            <h2 className="font-display text-2xl font-bold text-charcoal">Rent Requests</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-body text-charcoal/50 bg-cream">
              {filtered.length}
            </span>
          </div>
          <p className="font-body text-sm text-charcoal/40 ml-4">Monitor all rental activity across the platform</p>
        </div>

        <div className="flex gap-1 bg-cream rounded-xl p-1">
          {["all", "pending", "approved", "rejected", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize transition-all"
              style={filter === f
                ? { background: "linear-gradient(135deg,#E8621A,#F5874A)", color: "#fff", boxShadow: "0 4px 12px rgba(232,98,26,0.25)" }
                : { color: "rgba(26,26,46,0.5)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl animate-pulse h-36"
              style={{ border: "1px solid rgba(26,26,46,0.06)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl py-24 text-center" style={{ border: "1px solid rgba(26,26,46,0.06)" }}>
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Requests</h3>
          <p className="font-body text-sm text-charcoal/40">No rent requests in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((r) => {
            const st = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
            const img = r.property?.images?.[0] || getFallback(r._id);
            return (
              <div key={r._id} className="bg-white rounded-2xl overflow-hidden flex transition-all hover:shadow-card-hover"
                style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 2px 12px rgba(26,26,46,0.05)" }}>
                {/* Image strip */}
                <div className="w-28 flex-shrink-0 relative">
                  <img src={img} alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = getFallback(r._id); }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.15))" }} />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-sm font-bold text-charcoal truncate">
                      {r.property?.title || "Property"}
                    </h3>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-body flex-shrink-0 capitalize"
                      style={{ background: st.bg, color: st.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                      {r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[11px] text-orange">📍</span>
                    <span className="font-body text-[11px] text-charcoal/45 truncate">{r.property?.city}</span>
                    <span className="font-body text-[11px] text-charcoal/30 mx-1">·</span>
                    <span className="font-body text-[11px] font-semibold text-orange">₹{r.property?.price?.toLocaleString("en-IN")}/mo</span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: "linear-gradient(135deg,#6366F1,#818CF8)" }}>
                        {r.tenant?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-body text-[11px] text-charcoal/60">{r.tenant?.name}</span>
                    </div>
                    <span className="text-charcoal/20 text-xs">→</span>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                        {r.property?.owner?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-body text-[11px] text-charcoal/60">{r.property?.owner?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-body text-[11px] text-charcoal/35">
                    {r.moveInDate && (
                      <span>📅 {new Date(r.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                    <span>🕐 {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>

                  {r.message && (
                    <p className="font-body text-[11px] text-charcoal/35 mt-1.5 italic truncate">"{r.message}"</p>
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
