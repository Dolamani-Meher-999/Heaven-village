// PageOverlay.jsx
// Renders static pages (Contact, Support, Terms, Privacy) as a full-screen overlay
// on top of any dashboard. Triggered by the navigate() util from Footer links.

import { useState, useEffect } from "react";
import ContactPage from "../pages/ContactPage";
import SupportPage from "../pages/SupportPage";
import TermsPage   from "../pages/TermsPage";
import PrivacyPage from "../pages/PrivacyPage";

const PAGE_MAP = {
  contact: ContactPage,
  support: SupportPage,
  terms:   TermsPage,
  privacy: PrivacyPage,
};

export default function PageOverlay() {
  const [page, setPage] = useState(null); // null = hidden

  useEffect(() => {
    const handler = (e) => {
      setPage(e.detail.page);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hv:navigate", handler);
    return () => window.removeEventListener("hv:navigate", handler);
  }, []);

  if (!page) return null;

  const PageComponent = PAGE_MAP[page];
  if (!PageComponent) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-cream"
      style={{ animation: "slideInPage 0.25s ease forwards" }}
    >
      <style>{`
        @keyframes slideInPage {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sticky back bar */}
      <div
        className="sticky top-0 z-10 flex items-center gap-4 px-8 py-3 border-b border-gray-100"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)" }}
      >
        <button
          onClick={() => { setPage(null); window.scrollTo(0, 0); }}
          className="flex items-center gap-2 font-body text-sm font-semibold text-charcoal/60 hover:text-orange transition-colors group"
        >
          <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
          Back
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-display font-bold text-xs"
            style={{ background: "linear-gradient(135deg,#E8621A,#F5874A)" }}
          >H</div>
          <span className="font-display font-bold text-charcoal text-base leading-none">Heaven Village</span>
        </div>
        <div className="flex-1" />
        <span className="font-body text-xs text-charcoal/30 capitalize">{page}</span>
      </div>

      {/* Page content — no Navbar inside since we have the back bar */}
      <PageComponent />
    </div>
  );
}
