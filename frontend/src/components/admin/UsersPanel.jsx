import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function UsersPanel() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [actionId, setActionId] = useState(null);
  const token = localStorage.getItem("hv_token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) { console.error(err); }
    finally        { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user account?")) return;
    setActionId(id);
    try {
      await fetch(`${API}/api/admin/users/${id}/deactivate`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) { console.error(err); }
    finally        { setActionId(null); }
  };

  const filtered = users.filter((u) => {
    if (filter === "all")      return true;
    if (filter === "tenant")   return u.role === "tenant";
    if (filter === "owner")    return u.role === "owner";
    if (filter === "inactive") return !u.isActive;
    return true;
  });

  const roleBadge = (role) => ({
    tenant: "bg-blue-50 text-blue-600 border-blue-200",
    owner:  "bg-purple-50 text-purple-600 border-purple-200",
    admin:  "bg-red-50 text-red-600 border-red-200",
  }[role] || "bg-gray-100 text-gray-500");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 orange-gradient rounded-full" />
          <h2 className="font-display text-2xl font-bold text-charcoal">All Users</h2>
        </div>
        <div className="flex gap-2">
          {["all", "tenant", "owner", "inactive"].map((f) => (
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
            <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card py-20 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Users Found</h3>
          <p className="font-body text-sm text-charcoal/40">No users match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-cream border-b border-gray-100">
            {["Name", "Email", "Role", "Status", "Action"].map((h) => (
              <div key={h} className="font-body text-xs font-semibold text-charcoal/50 uppercase tracking-wide">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((u, i) => (
            <div
              key={u._id}
              className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center transition-colors hover:bg-cream/50 ${
                i !== filtered.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              {/* Name + avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full orange-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-body text-sm font-semibold text-charcoal truncate">{u.name}</div>
                  <div className="font-body text-xs text-charcoal/40">
                    Joined {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="font-body text-sm text-charcoal/60 truncate">{u.email}</div>

              {/* Role badge */}
              <div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-body font-semibold border capitalize ${roleBadge(u.role)}`}>
                  {u.role}
                </span>
              </div>

              {/* Active status */}
              <div>
                <span className={`flex items-center gap-1.5 font-body text-xs font-medium ${u.isActive !== false ? "text-green-600" : "text-red-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.isActive !== false ? "bg-green-500" : "bg-red-400"}`} />
                  {u.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Action */}
              <div>
                {u.role !== "admin" && u.isActive !== false ? (
                  <button
                    onClick={() => handleDeactivate(u._id)}
                    disabled={actionId === u._id}
                    className="px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg font-body text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                ) : u.role === "admin" ? (
                  <span className="font-body text-xs text-charcoal/30 italic">Protected</span>
                ) : (
                  <span className="font-body text-xs text-charcoal/30 italic">Inactive</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
