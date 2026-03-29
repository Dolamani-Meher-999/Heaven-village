export default function AdminNavbar({ activeTab, setActiveTab }) {
  const user = JSON.parse(localStorage.getItem("hv_user") || "{}");

  const tabs = [
    { id: "overview",   icon: "▦",  label: "Overview"      },
    { id: "properties", icon: "🏠", label: "Properties"    },
    { id: "users",      icon: "👥", label: "Users"         },
    { id: "requests",   icon: "📋", label: "Rent Requests" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("hv_token");
    localStorage.removeItem("hv_user");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 orange-gradient rounded-lg flex items-center justify-center text-white font-display font-bold text-sm">
            H
          </div>
          <span className="font-display font-bold text-charcoal text-lg">Heaven Village</span>
          <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-body font-bold rounded-md uppercase tracking-wide">
            Admin
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "orange-gradient text-white shadow-orange"
                  : "text-charcoal/60 hover:text-charcoal hover:bg-cream"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-body text-sm font-semibold text-charcoal">{user.name}</div>
            <div className="font-body text-xs text-charcoal/40">Administrator</div>
          </div>
          <div className="w-9 h-9 orange-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 font-body text-xs text-charcoal/40 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
