import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Heaven Village ("the Platform"), you confirm that you are at least 18 years of age, have read and understood these Terms of Use, and agree to be bound by them in full. If you are using the Platform on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.\n\nThese Terms constitute a legally binding agreement between you and Heaven Village Technologies Pvt. Ltd., registered in India. We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes your acceptance of the revised Terms.`,
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    content: `You must register for an account to access most features of the Platform. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.\n\nYou are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Heaven Village will not be liable for any loss or damage arising from your failure to protect your account.\n\nWe reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or misuse the Platform in any way.`,
  },
  {
    id: "listings",
    title: "3. Property Listings",
    content: `Owners who list properties on the Platform represent that they have the legal right to rent the property and that all information provided is accurate and truthful. Heaven Village reviews listings before they go live but does not independently verify every detail.\n\nListings must not contain misleading information, duplicate content, or content that violates any applicable law or third-party rights. Heaven Village reserves the right to remove any listing without notice.\n\nOwners are solely responsible for setting accurate rental prices, availability, and property conditions.`,
  },
  {
    id: "conduct",
    title: "4. User Conduct",
    content: `You agree not to use the Platform to:\n• Engage in any fraudulent, deceptive, or misleading activity\n• Harass, threaten, or intimidate other users\n• Collect personal information about other users without consent\n• Transmit spam, unsolicited communications, or malicious code\n• Attempt to gain unauthorised access to any part of the Platform or its systems\n• Post content that is defamatory, obscene, or in violation of any law\n\nViolation of these conduct rules may result in immediate account suspension and potential legal action.`,
  },
  {
    id: "payments",
    title: "5. Payments & Fees",
    content: `Heaven Village is currently free to use for both owners and tenants. We may introduce paid plans or service fees in the future, and will provide advance notice of any such changes.\n\nAll rental transactions are conducted directly between owners and tenants. Heaven Village is not a party to any rental agreement and does not hold, process, or guarantee any rental payments.\n\nUsers are responsible for all applicable taxes and legal obligations arising from their rental transactions.`,
  },
  {
    id: "privacy",
    title: "6. Privacy & Data",
    content: `Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Platform, you consent to the collection and use of your information as described in the Privacy Policy.\n\nWe implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, Heaven Village shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising out of or in connection with your use of the Platform.\n\nHeaven Village does not warrant that the Platform will be uninterrupted, error-free, or free of harmful components. The Platform is provided on an "as is" and "as available" basis.`,
  },
  {
    id: "termination",
    title: "8. Termination",
    content: `You may delete your account at any time by contacting support@heavenvillage.in. We may terminate or suspend your access immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or for any other reason at our sole discretion.\n\nUpon termination, your right to use the Platform ceases immediately. Sections relating to intellectual property, disclaimer of warranties, and limitation of liability shall survive termination.`,
  },
  {
    id: "governing",
    title: "9. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Bhubaneswar, Odisha, India.`,
  },
];

export default function TermsPage({ onLogin, onRegister }) {
  const [active, setActive] = useState("acceptance");

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
            Terms of <span style={{ color:"#F5874A" }}>Use</span>
          </h1>
          <p className="font-body text-white/40 text-base max-w-xl leading-relaxed">
            Please read these terms carefully before using Heaven Village. Last updated: <strong className="text-white/60">1 January 2025</strong>.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1100px] mx-auto px-8 py-16">
        <div className="flex gap-10 items-start">

          {/* Sidebar TOC */}
          <div className="w-64 flex-shrink-0 sticky top-28">
            <div className="bg-white rounded-2xl p-5"
              style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 16px rgba(26,26,46,0.05)" }}>
              <div className="font-body text-[11px] font-bold uppercase tracking-widest text-charcoal/40 mb-4">Table of Contents</div>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className="block px-3 py-2 rounded-xl font-body text-sm transition-all"
                    style={active === s.id
                      ? { background:"linear-gradient(135deg,rgba(232,98,26,0.1),rgba(245,135,74,0.08))", color:"#E8621A", fontWeight:600 }
                      : { color:"rgba(26,26,46,0.5)" }}>
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            {/* Info banner */}
            <div className="flex items-start gap-4 p-5 rounded-2xl mb-8"
              style={{ background:"rgba(232,98,26,0.06)", border:"1px solid rgba(232,98,26,0.15)" }}>
              <span className="text-2xl flex-shrink-0">📋</span>
              <div>
                <div className="font-body text-sm font-bold text-charcoal mb-1">Summary</div>
                <p className="font-body text-sm text-charcoal/55 leading-relaxed">
                  Heaven Village is a free platform connecting property owners and tenants in India. By using it, you agree to honest listings, respectful behaviour, and our privacy practices. Rental transactions happen directly between users — we are the facilitator, not the landlord.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {SECTIONS.map((s) => (
                <div key={s.id} id={s.id} className="bg-white rounded-2xl p-7 scroll-mt-28"
                  style={{ border:"1px solid rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.04)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 rounded-full flex-shrink-0"
                      style={{ background:"linear-gradient(180deg,#E8621A,#F5874A)" }} />
                    <h2 className="font-display text-lg font-bold text-charcoal">{s.title}</h2>
                  </div>
                  {s.content.split("\n").map((para, i) => (
                    <p key={i} className="font-body text-sm text-charcoal/60 leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="mt-8 p-6 rounded-2xl text-center"
              style={{ background:"linear-gradient(135deg,#1A1A2E,#2D2D44)" }}>
              <p className="font-body text-sm text-white/50 mb-3">
                Questions about these Terms? We're happy to help.
              </p>
              <a href="#contact" className="font-body text-sm font-bold text-orange hover:text-orange-light transition-colors">
                Contact our legal team →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
