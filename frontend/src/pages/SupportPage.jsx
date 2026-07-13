import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = [
  {
    icon: "🏠", title: "Property Listings",
    color: "#E8621A",
    articles: ["How to list your first property","Understanding approval timelines","Adding photos and amenities","Editing or deleting a listing"],
  },
  {
    icon: "🔑", title: "Renting a Property",
    color: "#4F46E5",
    articles: ["How to send a rent request","What happens after approval","Move-in checklist","Cancelling a rent request"],
  },
  {
    icon: "👤", title: "Account & Profile",
    color: "#059669",
    articles: ["Updating your profile info","Changing your password","Switching between roles","Deactivating your account"],
  },
  {
    icon: "💳", title: "Payments & Pricing",
    color: "#D97706",
    articles: ["Is Heaven Village free to use?","How do rental payments work?","Refund & cancellation policy","Invoice and receipts"],
  },
  {
    icon: "🛡️", title: "Safety & Trust",
    color: "#DB2777",
    articles: ["How we verify owners","Reporting suspicious listings","Our fraud prevention policy","Safe communication tips"],
  },
  {
    icon: "📱", title: "Technical Support",
    color: "#7C3AED",
    articles: ["Browser compatibility","Clearing cache & cookies","Image upload issues","Contacting technical support"],
  },
];

const GUIDES = [
  { title: "Getting Started as a Tenant",  time: "5 min read",  tag: "Popular",   icon: "🔑" },
  { title: "How to List Your Property",    time: "8 min read",  tag: "For Owners", icon: "🏠" },
  { title: "Understanding Rent Requests",  time: "4 min read",  tag: "Popular",   icon: "📋" },
  { title: "Safety Tips for Tenants",      time: "6 min read",  tag: "Safety",    icon: "🛡️" },
];

export default function SupportPage({ onLogin, onRegister }) {
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    articles: cat.articles.filter((a) =>
      !search || a.toLowerCase().includes(search.toLowerCase()) || cat.title.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((c) => c.articles.length > 0);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar onLogin={onLogin} onRegister={onRegister} />

      {/* Hero */}
      <section className="pt-32 pb-24 px-8 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          {[500, 680, 860].map((s, i) => (
            <div key={i} style={{ position:"absolute", width:s, height:s, borderRadius:"50%", border:"1px solid rgba(232,98,26,0.08)" }} />
          ))}
        </div>

        <div className="relative z-10 max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background:"rgba(232,98,26,0.15)", border:"1px solid rgba(232,98,26,0.25)" }}>
            <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-orange">Support Centre</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
            How can we <span style={{ color:"#F5874A" }}>help you?</span>
          </h1>
          <p className="font-body text-white/45 mb-8 text-base leading-relaxed">
            Search our knowledge base or browse categories below.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30 text-base">🔍</span>
            <input
              type="text"
              placeholder="Search for help articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-4 rounded-2xl font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 bg-white"
              style={{ border:"1px solid rgba(26,26,46,0.08)", boxShadow:"0 4px 24px rgba(26,26,46,0.1)" }}
            />
          </div>
          <p className="font-body text-xs text-white/25 mt-3">Popular: rent request, listing approval, account settings</p>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="max-w-[1100px] mx-auto px-8 -mt-8 mb-16">
        <div className="grid grid-cols-4 gap-4">
          {GUIDES.map((g) => (
            <div key={g.title} className="bg-white rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-card-hover"
              style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background:"linear-gradient(135deg,#E8621A18,#F5874A18)" }}>
                {g.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-body text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-orange"
                  style={{ background:"rgba(232,98,26,0.1)" }}>{g.tag}</span>
              </div>
              <h3 className="font-display text-sm font-bold text-charcoal mb-1 group-hover:text-orange transition-colors">{g.title}</h3>
              <p className="font-body text-xs text-charcoal/40">{g.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1100px] mx-auto px-8 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 rounded-full" style={{ background:"linear-gradient(180deg,#E8621A,#F5874A)" }} />
          <h2 className="font-display text-2xl font-bold text-charcoal">Browse by Category</h2>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {filtered.map((cat, i) => (
            <div key={cat.title} className="bg-white rounded-2xl overflow-hidden"
              style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
              {/* Category header */}
              <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream/50 transition-colors"
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background:`${cat.color}15` }}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-bold text-charcoal">{cat.title}</div>
                  <div className="font-body text-xs text-charcoal/40">{cat.articles.length} articles</div>
                </div>
                <span className="text-orange text-lg font-light transition-transform duration-200"
                  style={{ transform: expanded === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>

              {/* Articles list */}
              <div className={`overflow-hidden transition-all duration-300 ${expanded === i ? "max-h-96" : "max-h-0"}`}>
                <div className="px-5 pb-5 pt-1 space-y-1"
                  style={{ borderTop:"1px solid rgba(26,26,46,0.05)" }}>
                  {cat.articles.map((a) => (
                    <a key={a} href="#"
                      className="flex items-center gap-2 py-2 font-body text-sm text-charcoal/60 hover:text-orange transition-colors group">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="group-hover:underline underline-offset-2">{a}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Preview (collapsed) */}
              {expanded !== i && (
                <div className="px-5 pb-4 space-y-1">
                  {cat.articles.slice(0, 2).map((a) => (
                    <div key={a} className="flex items-center gap-2 py-1">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="font-body text-xs text-charcoal/40 truncate">{a}</span>
                    </div>
                  ))}
                  {cat.articles.length > 2 && (
                    <span className="font-body text-xs text-orange ml-3">+{cat.articles.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still need help CTA */}
      <section className="max-w-[1100px] mx-auto px-8 mb-20">
        <div className="rounded-3xl px-10 py-12 text-center relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#1A1A2E 0%,#2D2D44 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle, rgba(232,98,26,0.1) 1px, transparent 1px)", backgroundSize:"30px 30px" }} />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Still need help?</h2>
            <p className="font-body text-white/45 mb-7 text-sm">Our support team is available Mon–Sat, 9 AM to 7 PM IST.</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#contact"
                className="px-8 py-3 rounded-xl font-body text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background:"linear-gradient(135deg,#E8621A,#F5874A)", boxShadow:"0 8px 24px rgba(232,98,26,0.3)" }}>
                Contact Support →
              </a>
              <a href="mailto:support@heavenvillage.in"
                className="px-8 py-3 rounded-xl font-body text-sm font-semibold text-white/60 hover:text-white transition-colors"
                style={{ border:"1px solid rgba(255,255,255,0.1)" }}>
                support@heavenvillage.in
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
