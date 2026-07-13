// No onNavigate prop needed — uses window events so works in ALL dashboards

const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Browse Properties", page: null },
      { label: "List Property",     page: null },
      { label: "How It Works",      page: null },
      { label: "Pricing",           page: null },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", page: null      },
      { label: "Careers",  page: null      },
      { label: "Press",    page: null      },
      { label: "Contact",  page: "contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", page: "privacy" },
      { label: "Terms of Use",   page: "terms"   },
      { label: "Cookie Policy",  page: null      },
      { label: "Support",        page: "support" },
    ],
  },
];

// Fire a window event — PageOverlay in App.jsx listens to this
const go = (page) => {
  if (!page) return;
  window.dispatchEvent(new CustomEvent("hv:navigate", { detail: { page } }));
};

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/8 pt-14 pb-8 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="font-display text-[22px] font-bold text-white mb-4">
              Heaven{" "}
              <span style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Village
              </span>
            </div>
            <p className="font-body text-sm text-white/40 leading-relaxed max-w-[280px] mb-6">
              India's most trusted rental platform connecting verified owners with quality tenants.
            </p>
            <div className="flex items-center gap-3">
              {["𝕏", "in", "f", "▶"].map((s) => (
                <a key={s} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white/40 hover:text-orange transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="font-body text-[11px] font-bold tracking-[0.12em] text-orange uppercase mb-5">
                {col.title}
              </div>
              {col.links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => go(link.page)}
                  className={`block w-full text-left font-body text-sm mb-2.5 transition-colors duration-200 ${
                    link.page ? "text-white/40 hover:text-orange cursor-pointer" : "text-white/20 cursor-default"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 flex items-center justify-between">
          <p className="font-body text-sm text-white/25">© 2025 Heaven Village. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", page: "privacy" },
              { label: "Terms of Use",   page: "terms"   },
              { label: "Support",        page: "support" },
            ].map((l) => (
              <button key={l.label} onClick={() => go(l.page)}
                className="font-body text-xs text-white/25 hover:text-orange transition-colors cursor-pointer">
                {l.label}
              </button>
            ))}
          </div>
          <p className="font-body text-sm text-white/25">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  );
}
