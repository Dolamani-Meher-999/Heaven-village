import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "collect",
    title: "1. Information We Collect",
    icon: "📥",
    content: `We collect information you provide directly, such as your name, email address, phone number, and profile details when you register on Heaven Village.\n\nFor property owners, we also collect property details including address, photos, pricing, and amenities.\n\nWe automatically collect usage data such as pages visited, search queries, device type, browser, and IP address to improve your experience and ensure platform security.`,
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    icon: "⚙️",
    content: `We use your information to:\n• Operate, maintain, and improve the Heaven Village platform\n• Match tenants with suitable property listings\n• Send transactional emails such as booking confirmations and account alerts\n• Prevent fraudulent activity and ensure user safety\n• Respond to your enquiries and provide customer support\n• Comply with our legal obligations under Indian law`,
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    icon: "🤝",
    content: `We do not sell your personal information to third parties. We may share information with:\n\nService providers who help us operate the platform (e.g. cloud hosting, email delivery) — these parties are bound by confidentiality agreements.\n\nOther users, but only to the extent necessary — for example, a tenant's name and contact is shared with an owner only after a rent request is accepted.\n\nLaw enforcement or government bodies when required by applicable Indian law or to protect the rights and safety of our users.`,
  },
  {
    id: "storage",
    title: "4. Data Storage & Security",
    icon: "🔒",
    content: `Your data is stored on secure servers hosted on MongoDB Atlas (AWS Mumbai region), ensuring data residency within India.\n\nWe use industry-standard security measures including TLS encryption for data in transit, bcrypt password hashing, and JWT-based authentication with expiry controls.\n\nWhile we implement these measures, no system is perfectly secure. We encourage you to use a strong, unique password and to notify us immediately if you suspect unauthorised access to your account.`,
  },
  {
    id: "rights",
    title: "5. Your Rights",
    icon: "✅",
    content: `Under applicable Indian data protection law, you have the right to:\n• Access the personal data we hold about you\n• Correct inaccurate or incomplete data\n• Request deletion of your account and associated data\n• Object to processing of your data for marketing purposes\n• Withdraw consent at any time where processing is based on consent\n\nTo exercise any of these rights, email us at privacy@heavenvillage.in. We will respond within 30 days.`,
  },
  {
    id: "cookies",
    title: "6. Cookies",
    icon: "🍪",
    content: `We use cookies and similar technologies to maintain your login session, remember your preferences, and analyse how the platform is used.\n\nEssential cookies are required for the platform to function and cannot be disabled. Analytics cookies help us understand usage patterns — you can opt out of these through your browser settings.\n\nWe do not use third-party advertising cookies.`,
  },
  {
    id: "changes",
    title: "7. Changes to This Policy",
    icon: "📝",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top and, for material changes, notify you via email or a prominent notice on the platform.\n\nWe encourage you to review this policy periodically. Your continued use of Heaven Village after any changes constitutes your acceptance of the revised policy.`,
  },
];

export default function PrivacyPage({ onLogin, onRegister }) {
  const [active, setActive] = useState("collect");

  return (
    <div className="min-h-screen bg-cream">
      <Navbar onLogin={onLogin} onRegister={onRegister} />

      {/* Hero */}
      <section className="pt-32 pb-16 px-8"
        style={{ background:"linear-gradient(160deg,#1A1A2E 0%,#2D2D44 100%)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background:"rgba(232,98,26,0.15)", border:"1px solid rgba(232,98,26,0.25)" }}>
            <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-orange">Legal</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
            Privacy <span style={{ color:"#F5874A" }}>Policy</span>
          </h1>
          <p className="font-body text-white/40 text-base max-w-xl leading-relaxed">
            Your privacy matters to us. Last updated: <strong className="text-white/60">1 January 2025</strong>.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1100px] mx-auto px-8 py-16">
        <div className="flex gap-10 items-start">

          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 sticky top-28">
            <div className="bg-white rounded-2xl p-5"
              style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 16px rgba(26,26,46,0.05)" }}>
              <div className="font-body text-[11px] font-bold uppercase tracking-widest text-charcoal/40 mb-4">Contents</div>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-body text-sm transition-all"
                    style={active === s.id
                      ? { background:"rgba(232,98,26,0.08)", color:"#E8621A", fontWeight:600 }
                      : { color:"rgba(26,26,46,0.5)" }}>
                    <span style={{ fontSize:14 }}>{s.icon}</span>
                    <span>{s.title.replace(/^\d+\.\s/, "")}</span>
                  </a>
                ))}
              </nav>
              <div className="mt-5 pt-5" style={{ borderTop:"1px solid rgba(26,26,46,0.06)" }}>
                <div className="font-body text-xs text-charcoal/35 leading-relaxed">
                  Questions? Email us at{" "}
                  <a href="mailto:privacy@heavenvillage.in" className="text-orange">privacy@heavenvillage.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Commitment banner */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon:"🔒", label:"Data Stored in India",     sub:"Mumbai AWS region"       },
                { icon:"🚫", label:"Never Sold",               sub:"Your data stays yours"   },
                { icon:"✉️", label:"Transparent Updates",      sub:"Email on any changes"    },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-2xl p-4 text-center"
                  style={{ border:"1px solid rgba(26,26,46,0.07)" }}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-body text-xs font-bold text-charcoal mb-0.5">{c.label}</div>
                  <div className="font-body text-[11px] text-charcoal/40">{c.sub}</div>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {SECTIONS.map((s) => (
                <div key={s.id} id={s.id} className="bg-white rounded-2xl p-7 scroll-mt-28"
                  style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.04)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background:"linear-gradient(135deg,rgba(232,98,26,0.1),rgba(245,135,74,0.08))" }}>
                      {s.icon}
                    </div>
                    <h2 className="font-display text-lg font-bold text-charcoal">{s.title}</h2>
                  </div>
                  {s.content.split("\n").map((para, i) => (
                    <p key={i} className="font-body text-sm text-charcoal/60 leading-relaxed mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl text-center"
              style={{ background:"linear-gradient(135deg,#1A1A2E,#2D2D44)" }}>
              <p className="font-body text-sm text-white/50 mb-3">Still have privacy concerns?</p>
              <a href="mailto:privacy@heavenvillage.in"
                className="font-body text-sm font-bold text-orange hover:text-orange-light transition-colors">
                privacy@heavenvillage.in →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
