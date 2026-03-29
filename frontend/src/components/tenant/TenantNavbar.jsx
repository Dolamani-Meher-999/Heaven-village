import { useState, useRef, useEffect } from "react";

export default function TenantNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("hv_user") || "{}");

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { localStorage.removeItem("hv_token"); localStorage.removeItem("hv_user"); window.location.href = "/"; };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_20px_rgba(26,26,46,0.08)] border-b border-gray-100 px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg orange-gradient flex items-center justify-center text-base font-black text-white">H</div>
        <span className="font-display text-lg font-bold text-charcoal">Heaven <span className="orange-text">Village</span></span>
      </div>

      <div className="flex items-center gap-1">
        {[{ label:"Browse", icon:"⊞" }, { label:"Saved", icon:"♡" }, { label:"My Requests", icon:"📋" }].map((item) => (
          <button key={item.label}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-sm font-medium text-charcoal/50 hover:text-charcoal hover:bg-gray-50 transition-all duration-200">
            <span className="text-orange">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3" ref={dropdownRef}>
        <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-charcoal/40 hover:text-orange hover:border-orange/20 transition-all duration-200 relative">
          🔔
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full orange-gradient text-white text-[9px] font-bold flex items-center justify-center">2</span>
        </button>

        <div className="relative">
          <button onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 hover:border-orange/25 hover:bg-orange/4 transition-all duration-200">
            <div className="w-7 h-7 rounded-lg orange-gradient flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "T"}
            </div>
            <div className="text-left">
              <div className="font-body text-sm font-semibold text-charcoal leading-none mb-0.5">{user?.name?.split(" ")[0] || "Tenant"}</div>
              <div className="font-body text-[10px] text-orange leading-none">Tenant</div>
            </div>
            <span className="text-charcoal/25 text-xs ml-1">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_20px_60px_rgba(26,26,46,0.12)] overflow-hidden">
              {[{ icon:"👤", label:"My Profile" }, { icon:"♡", label:"Saved Properties" }, { icon:"📋", label:"My Requests" }, { icon:"⚙️", label:"Settings" }].map((item) => (
                <button key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-charcoal/60 hover:text-charcoal hover:bg-gray-50 transition-all duration-150 text-left">
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-red-500 hover:bg-red-50 transition-all duration-150 text-left">
                  <span>⎋</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
