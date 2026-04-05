import { useState, useEffect } from "react";

export default function RentRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const token = localStorage.getItem("hv_token");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/properties/owner/rent-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id, status) => {
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/properties/owner/rent-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchRequests();
    } catch (err) { console.error(err); }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const statusConfig = {
    pending:  { label: "Pending",  bg: "bg-orange/8",  text: "text-orange",    border: "border-orange/25"  },
    approved: { label: "Approved", bg: "bg-green-50",  text: "text-green-600", border: "border-green-200"  },
    rejected: { label: "Rejected", bg: "bg-red-50",    text: "text-red-500",   border: "border-red-200"    },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Rent Requests</h2>
          <p className="font-body text-sm text-charcoal/45 mt-0.5">Manage incoming requests from tenants</p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg font-body text-xs font-semibold capitalize transition-all duration-200 ${
                filter === f ? "bg-white text-charcoal shadow-sm" : "text-charcoal/50 hover:text-charcoal"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Requests Found</h3>
          <p className="font-body text-sm text-charcoal/40">
            {filter === "all" ? "You haven't received any rent requests yet." : `No ${filter} requests.`}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((req) => {
            const sc  = statusConfig[req.status] || statusConfig.pending;
            const img = req.property?.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80";

            return (
              <div key={req._id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-start gap-5">
                  {/* Property image */}
                  <img src={img} alt={req.property?.title}
                    className="w-20 h-16 rounded-xl object-cover shrink-0" />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-display text-base font-bold text-charcoal">
                          {req.property?.title || "Property"}
                        </h4>
                        <p className="font-body text-xs text-charcoal/45">
                          📍 {req.property?.location?.city}
                          <span className="mx-2 text-charcoal/20">•</span>
                          ₹{req.property?.price?.toLocaleString("en-IN")}/month
                        </p>
                      </div>
                      <span className={`font-body text-[11px] font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                        {sc.label}
                      </span>
                    </div>

                    {/* Tenant info */}
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-3">
                      <div className="w-8 h-8 rounded-lg orange-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {req.tenant?.name?.[0]?.toUpperCase() || "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-body text-sm font-semibold text-charcoal">{req.tenant?.name}</div>
                        <div className="font-body text-xs text-charcoal/45">{req.tenant?.email}</div>
                      </div>
                      {req.moveInDate && (
                        <div className="text-right shrink-0">
                          <div className="font-body text-[10px] text-charcoal/40 uppercase tracking-wide">Move-in</div>
                          <div className="font-body text-xs font-semibold text-charcoal">
                            {new Date(req.moveInDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {req.message && (
                      <p className="font-body text-xs text-charcoal/55 italic bg-orange/4 border border-orange/10 rounded-lg px-3 py-2 mb-3">
                        "{req.message}"
                      </p>
                    )}

                    {/* Date + Actions */}
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs text-charcoal/35">
                        Received: {new Date(req.createdAt).toLocaleDateString("en-IN")}
                      </span>

                      {req.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(req._id, "rejected")}
                            className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 font-body text-xs font-bold text-red-500 hover:bg-red-100 transition-colors">
                            ✗ Decline
                          </button>
                          <button onClick={() => handleAction(req._id, "approved")}
                            className="px-4 py-2 rounded-xl orange-gradient font-body text-xs font-bold text-white shadow-orange hover:opacity-90 transition-opacity">
                            ✓ Approve
                          </button>
                        </div>
                      )}

                      {req.status === "approved" && (
                        <span className="font-body text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                          ✓ Approved on {new Date(req.respondedAt).toLocaleDateString("en-IN")}
                        </span>
                      )}

                      {req.status === "rejected" && (
                        <span className="font-body text-xs text-red-500 font-semibold bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                          ✗ Declined
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
