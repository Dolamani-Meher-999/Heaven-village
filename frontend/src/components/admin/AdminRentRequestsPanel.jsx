import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function AdminRentRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const token = localStorage.getItem("hv_token");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/admin/rent-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(data.data || []);
      } catch (err) { console.error(err); }
      finally        { setLoading(false); }
    };
    fetchRequests();
  }, []);

  const filtered = filter === "all"
    ? requests
    : requests.filter((r) => r.status === filter);

  const statusColor = (s) => ({
    pending:  "bg-amber-50 text-amber-600 border-amber-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-500 border-red-200",
    cancelled:"bg-gray-100 text-gray-500 border-gray-200",
  }[s] || "bg-gray-100 text-gray-500");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 orange-gradient rounded-full" />
          <h2 className="font-display text-2xl font-bold text-charcoal">All Rent Requests</h2>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "orange-gradient text-white shadow-orange"
                  : "bg-white border border-gray-200 text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-20 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Requests</h3>
          <p className="font-body text-sm text-charcoal/40">No rent requests in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-4 flex gap-4 items-start">
              {/* Property image */}
              <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark">
                {r.property?.images?.[0] ? (
                  <img src={r.property.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-sm font-bold text-charcoal truncate">
                    {r.property?.title || "Property"}
                  </h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-body font-semibold border capitalize ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 font-body text-xs text-charcoal/50">
                  <span>🏠 {r.property?.city}</span>
                  <span>₹{r.property?.price?.toLocaleString()}/mo</span>
                  <span>
                    📅 Move-in: {r.moveInDate ? new Date(r.moveInDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                  <span>
                    🕐 {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex gap-4 mt-1.5 font-body text-xs text-charcoal/40">
                  <span>Tenant: <span className="text-charcoal/60 font-medium">{r.tenant?.name}</span></span>
                  <span>Owner: <span className="text-charcoal/60 font-medium">{r.property?.owner?.name}</span></span>
                </div>
                {r.message && (
                  <p className="font-body text-xs text-charcoal/40 mt-1 italic truncate">"{r.message}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
