import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const ROLE_STYLES = {
  tenant: { bg: "#EFF6FF", color: "#1D4ED8", border: "rgba(59,130,246,0.2)" },
  owner:  { bg: "#F5F3FF", color: "#6D28D9", border: "rgba(139,92,246,0.2)" },
  admin:  { bg: "#FEF2F2", color: "#B91C1C", border: "rgba(239,68,68,0.2)"  },
};

export default function UsersPanel() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [actionId, setActionId] = useState(null);
  const [search,   setSearch]   = useState("");
  const token = localStorage.getItem("hv_token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
    finally { setActionId(null); }
  };

  const filtered = users.filter((u) => {
    const matchFilter = filter === "all" || u.role === filter || (filter === "inactive" && !u.isActive);
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg,#E8621A,#F5874A)" }} />
            <h2 className="font-display text-2xl font-bold text-charcoal">All Users</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-body text-charcoal/50 bg-cream">
              {filtered.length}
            </span>
          </div>
          <p className="font-body text-sm text-charcoal/40 ml-4">Manage platform users and their access</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl font-body text-sm bg-cream border-0 focus:outline-none focus:ring-2 focus:ring-orange/20 text-charcoal placeholder-charcoal/30"
              style={{ border: "1px solid rgba(26,26,46,0.08)" }}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-cream rounded-xl p-1">
            {["all", "tenant", "owner", "inactive"].map((f) => (
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
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(26,26,46,0.07)" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-cream-dark" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-cream-dark rounded w-1/4" />
                <div className="h-3 bg-cream-dark rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl py-24 text-center" style={{ border: "1px solid rgba(26,26,46,0.07)" }}>
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-display text-xl font-bold text-charcoal mb-2">No Users Found</h3>
          <p className="font-body text-sm text-charcoal/40">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(26,26,46,0.07)", boxShadow: "0 2px 20px rgba(26,26,46,0.06)" }}>
          {/* Table head */}
          <div className="grid gap-4 px-6 py-3.5 bg-cream/70"
            style={{ gridTemplateColumns: "2.5fr 2fr 100px 90px 110px", borderBottom: "1px solid rgba(26,26,46,0.06)" }}>
            {["User", "Email", "Role", "Status", "Action"].map((h) => (
              <div key={h} className="font-body text-[11px] font-bold uppercase tracking-wider text-charcoal/40">{h}</div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((u, i) => {
            const rs = ROLE_STYLES[u.role] || ROLE_STYLES.tenant;
            return (
              <div
                key={u._id}
                className="grid gap-4 px-6 py-4 items-center transition-colors hover:bg-cream/40"
                style={{
                  gridTemplateColumns: "2.5fr 2fr 100px 90px 110px",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(26,26,46,0.04)" : "none",
                }}
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-body text-sm font-semibold text-charcoal truncate">{u.name}</div>
                    <div className="font-body text-[11px] text-charcoal/35">
                      Joined {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="font-body text-sm text-charcoal/55 truncate">{u.email}</div>

                {/* Role */}
                <div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-body capitalize"
                    style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>
                    {u.role}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full"
                    style={{ background: u.isActive !== false ? "#10B981" : "#EF4444" }} />
                  <span className="font-body text-xs font-semibold"
                    style={{ color: u.isActive !== false ? "#065F46" : "#991B1B" }}>
                    {u.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Action */}
                <div>
                  {u.role !== "admin" && u.isActive !== false ? (
                    <button
                      onClick={() => handleDeactivate(u._id)}
                      disabled={actionId === u._id}
                      className="px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {actionId === u._id ? "…" : "Deactivate"}
                    </button>
                  ) : u.role === "admin" ? (
                    <span className="font-body text-xs text-charcoal/25 italic">Protected</span>
                  ) : (
                    <span className="font-body text-xs text-charcoal/25 italic">Inactive</span>
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
