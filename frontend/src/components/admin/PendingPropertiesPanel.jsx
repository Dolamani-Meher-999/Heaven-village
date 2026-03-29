import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function PendingPropertiesPanel({ filterAll = false }) {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState(filterAll ? "all" : "pending");
  const [actionId,   setActionId]   = useState(null);
  const token = localStorage.getItem("hv_token");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const url = filter === "pending"
        ? `${API}/api/admin/properties/pending`
        : `${API}/api/admin/properties`;
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProperties(data.data || []);
    } catch (err) { console.error(err); }
    finally        { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, [filter]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await fetch(`${API}/api/admin/properties/${id}/approve`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (err) { console.error(err); }
    finally        { setActionId(null); }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this property listing?")) return;
    setActionId(id);
    try {
      await fetch(`${API}/api/admin/properties/${id}/reject`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      fetchProperties();
    } catch (err) { console.error(err); }
    finally        { setActionId(null); }
  };

  const statusColor = (s) => ({
    pending:  "bg-amber-50 text-amber-600 border-amber-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-500 border-red-200",
  }[s] || "bg-gray-100 text-gray-500");

  return (
    <div>
      {/* Header + filter tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 orange-gradient rounded-full" />
          <h2 className="font-display text-2xl font-bold text-charcoal">
            {filterAll ? "All Properties" : "Pending Properties"}
          </h2>
        </div>
        {filterAll && (
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((f) => (
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
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-20 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">All Clear!</h3>
          <p className="font-body text-sm text-charcoal/40">No properties in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow p-4 flex gap-4 items-start">
              {/* Image */}
              <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-base font-bold text-charcoal truncate">{p.title}</h3>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-body font-semibold border capitalize ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <p className="font-body text-xs text-charcoal/45 mb-1">
                  📍 {p.address}, {p.city}
                </p>
                <div className="flex items-center gap-3 text-xs font-body text-charcoal/50">
                  <span>🛏 {p.bedrooms} Beds</span>
                  <span>🚿 {p.bathrooms} Baths</span>
                  <span className="capitalize">{p.propertyType}</span>
                  <span className="font-semibold text-orange">₹{p.price?.toLocaleString()}/mo</span>
                </div>
                {p.owner && (
                  <p className="font-body text-xs text-charcoal/40 mt-1">
                    Owner: <span className="text-charcoal/60 font-medium">{p.owner.name}</span> · {p.owner.email}
                  </p>
                )}
              </div>

              {/* Actions */}
              {p.status === "pending" && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(p._id)}
                    disabled={actionId === p._id}
                    className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg font-body text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(p._id)}
                    disabled={actionId === p._id}
                    className="px-4 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg font-body text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
