export default function AdminNavbar({ activeTab, setActiveTab }) {
  const user = JSON.parse(localStorage.getItem("hv_user") || "{}");

  const tabs = [
    { id: "overview",   label: "Overview",   icon: "▦" },
    { id: "properties", label: "Properties", icon: "🏠" },
    { id: "users",      label: "Users",      icon: "👥" },
    { id: "requests",   label: "Requests",   icon: "📋" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("hv_token");
    localStorage.removeItem("hv_user");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(26,26,46,0.07)",
        boxShadow: "0 1px 20px rgba(26,26,46,0.06)",
      }}>
      <div className="max-w-[1280px] mx-auto px-8 h-[68px] flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg"
            style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)", boxShadow: "0 4px 14px rgba(232,98,26,0.35)" }}>
            H
          </div>
          <div>
            <div className="font-display font-bold text-charcoal leading-tight" style={{ fontSize: 17, letterSpacing: "-0.01em" }}>
              Heaven Village
            </div>
            <div className="font-body font-bold uppercase text-orange leading-none"
              style={{ fontSize: 9.5, letterSpacing: "0.18em" }}>
              Admin Console
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-gray-200 mx-1" />

          {/* Admin badge */}
          <span className="px-2.5 py-1 rounded-lg font-body font-bold uppercase text-red-600"
            style={{ fontSize: 10, letterSpacing: "0.1em", background: "#FEF2F2", border: "1px solid rgba(220,38,38,0.15)" }}>
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center rounded-2xl p-1 gap-0.5"
          style={{ background: "#F0EDE8" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-body font-semibold transition-all duration-200"
              style={{
                fontSize: 13.5,
                ...(activeTab === tab.id
                  ? {
                      background: "linear-gradient(135deg,#E8621A,#F5874A)",
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(232,98,26,0.3)",
                    }
                  : { color: "rgba(26,26,46,0.45)" }),
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-display font-bold text-charcoal leading-tight" style={{ fontSize: 13.5 }}>
              {user.name}
            </div>
            <div className="font-body text-charcoal/40" style={{ fontSize: 11 }}>Administrator</div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{
              background: "linear-gradient(135deg,#E8621A,#F5874A)",
              boxShadow: "0 4px 12px rgba(232,98,26,0.3)",
              fontSize: 15,
            }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout}
            className="font-body font-semibold text-charcoal/35 hover:text-red-500 transition-colors rounded-lg px-3 py-1.5"
            style={{ fontSize: 12, border: "1px solid rgba(26,26,46,0.1)" }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
